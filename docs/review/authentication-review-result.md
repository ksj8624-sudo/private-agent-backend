Authentication Backend Review
참고 문서 확인: review.md, feature.md, login-auth.md 정상 확인. login-auth.md는 지난 확인 이후(8/6→8/11 14:33) 수정된 흔적이 있어 다시 읽었는데, "인증 미들웨어가 없다"는 문장이 삭제된 것 외에 실질적 내용 차이는 없었습니다. API Contract는 지정 경로(docs/api/backend-api-spec.xlsx)가 여전히 존재하지 않아, 기존에 합의된 docs/backend-api-spec.xlsx로 대체해 리뷰했습니다.

Review 대상: authService.js, authMiddleware.js, authController.js, userRepository.js, routes/auth.js, db/sqlite.js, scripts/seed-admin-user.js, routes/api.js/routes/reviewHistory.js(미들웨어 적용부), env.js, index.js — 이번 Feature에서 변경된 파일만 대상으로 함. 코드는 수정하지 않았습니다.

Critical
Critical 없음.

Major

1. Refresh Token Rotation이 원자적(atomic)이지 않음
   authService.js:112-115 (refresh)에서 revokeRefreshTokenById(stored.id) 실행 후 issueTokenPair(user) 내부의 saveRefreshToken(45-49행)이 별도의 DB 쓰기로 이어집니다. 두 쓰기 사이에 프로세스가 중단되면 사용자는 "폐기된 옛 토큰"만 남고 "새 토큰"은 없는 상태가 되어 재로그인이 강제됩니다. better-sqlite3는 동기 API라 db.transaction(fn)()로 감싸기 쉬운데 적용되지 않았습니다.

2. Access Token 검증에서 설계 8절의 "사용자 정보 조회" 단계가 생략됨
   login-auth.md 8절 인증 미들웨어 흐름은 3. JWT 서명/만료 검증 다음에 4. 사용자 정보 조회를 별도 단계로 명시합니다. 그런데 authService.js:138-145(verifyAccessToken)는 JWT payload(decoded.sub, decoded.email)만 신뢰하고 DB 조회를 하지 않으며, authMiddleware.js:19도 이를 그대로 req.user에 주입합니다. 결과적으로 계정이 비활성화되거나 삭제되어도 이미 발급된 Access Token은 만료(최대 15분)될 때까지 /api/ask, /api/plan, /api/review, /reviewHistory에 계속 접근할 수 있습니다. 반면 getMe(147-153행)는 매번 findById + is_active 재확인을 하고 있어, 같은 Access Token인데 /api/auth/me와 나머지 보호 API의 신선도(freshness) 검증 수준이 다릅니다.

Minor
authService.js login()(62-76행)과 refresh()(95-110행) 각각에서 동일한 AuthError 생성 코드가 3~4번 반복됩니다. 조건을 하나로 묶거나 헬퍼로 추출하면 중복이 줄어듭니다.
login()만 async(59행)이고 refresh/logout/getMe(84, 118, 147행)는 동기 함수입니다. 실제 동작에는 문제 없지만, 같은 서비스 모듈 안에서 호출 규약이 섞여 있어 향후 유지보수 시 혼동 여지가 있습니다.
class AuthError extends Error(7-13행)는 프로젝트 전체를 통틀어 유일한 class 사용입니다. 나머지 코드베이스는 순수 함수/객체 스타일이라 다소 이질적입니다(방식 자체는 표준적이라 문제라기보다는 스타일 참고 사항).
env.js:7-8에 JWT_ACCESS_SECRET/JWT_REFRESH_SECRET에 대한 fail-fast 검증이 없어, 값이 비어있으면 jwt.sign이 그 시점에 예외를 던지고 이 앱에 전역 에러 핸들러가 없어 비-JSON 500으로 응답됩니다. 앱 전체의 기존 패턴과 동일하지만, 서버 기동 시점에 필수 값 존재를 확인하는 방식을 고려할 만합니다.
login()의 issueTokenPair(refresh_tokens insert)와 updateLastLogin(78-79행) 사이도 비원자적이지만, 실패 시 영향은 last_login_at 미갱신 정도로 낮습니다.
Good
Route(auth.js) → Controller(authController.js) → Service(authService.js) → Repository(userRepository.js) 계층이 정확히 지켜졌고, 각 계층의 책임(HTTP 처리 / 비즈니스 로직 / DB 접근)이 명확히 분리되어 있습니다.
API Contract(xlsx) AUTH-001~004의 Request/Response 필드명·타입과 Error Code(validation_failed/invalid_credentials/invalid_refresh_token/unauthorized)가 코드와 정확히 일치하며, 실제 서버 기동 후 16종 curl 테스트로 재확인했습니다.
Refresh Token을 원문이 아닌 SHA-256 해시로 저장(hashToken, authService.js:26)하고, 원문은 발급 응답에만 1회 노출됩니다 — 설계 4.3/11.2절 원칙 준수.
Rotation 재사용 탐지가 정확합니다. revokeRefreshTokenById가 WHERE id = ? AND revoked_at IS NULL(userRepository.js:61) 조건으로 이중 폐기를 막고, refresh()가 stored.revoked_at을 확인해 이미 회전된 토큰의 재사용을 401로 차단합니다(라이브 테스트로 확인).
Middleware를 라우터 전체가 아닌 /api/ask, /api/plan, /api/review, /reviewHistory, /api/auth/me 개별 라우트에만 정밀 적용해(routes/api.js, routes/reviewHistory.js) 설계 8절의 보호 대상 분류를 임의 확장 없이 그대로 반영했습니다.
모든 DB 접근이 Prepared Statement(?/@named) 기반이라 SQL Injection 위험이 없습니다.
비밀번호·토큰이 어떤 console.log에도 노출되지 않습니다(설계 4.3/13절 준수, 로그 직접 확인됨).
Summary
설계(login-auth.md) 일치 여부: 대체로 일치. 다만 Access Token 미들웨어의 "사용자 정보 조회" 단계(8절)가 생략되어 부분적으로 불일치(Major #2).
API Contract(backend-api-spec.xlsx) 일치 여부: 완전히 일치. 필드/타입/에러코드를 코드와 xlsx 양쪽에서 대조하고 실제 호출로도 검증함.
Authentication Architecture 평가: Route→Controller→Service→Repository 계층 분리가 명확하고 일관됨. Middleware도 필요한 라우트에만 정밀 적용됨.
보안 평가: 비밀번호 해시, Refresh Token 해시 저장, Rotation, 로그 비노출 등 핵심 원칙은 잘 지켜짐. 다만 Access Token에 대한 실시간 사용자 상태(비활성/삭제) 재검증이 없다는 점(Major #2)과 Rotation의 트랜잭션 부재(Major #1)는 프로덕션 반영 전 보완이 필요.
유지보수성 평가: 계층이 명확해 확장은 용이하나, 반복되는 에러 처리 코드와 서비스 메서드 간 sync/async 비대칭 등 소소한 정리 여지가 있음(Minor).
최종 평가: Critical 없음, Major 2건(Rotation 원자성, Access Token 사용자 상태 재검증 부재)은 수정 권장. 전반적으로 설계·API Contract를 충실히 따른 견고한 구현.
