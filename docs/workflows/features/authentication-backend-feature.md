# Authentication Backend Feature

## 1. 작업 목표

Private Agent Backend에 실제 로그인 Authentication 기능을 구현한다.

이번 작업은 이미 작성된 설계 문서와 API Contract를 기준으로 진행한다.

회원가입, 비밀번호 찾기, 소셜 로그인은 이번 범위에서 제외한다.

---

## 2. 수정 대상 프로젝트

- `/Users/kimseongjin/Desktop/workspace/private-agent-backend`

---

## 3. 참고 대상

구현 전에 반드시 다음 문서를 확인한다.

### Authentication 설계

- `/Users/kimseongjin/Desktop/workspace/ai-agent-lab/docs/designs/login-auth.md`

### Backend API Contract

- `/Users/kimseongjin/Desktop/workspace/private-agent-backend/docs/backend-api-spec.xlsx`

### Backend Platform Rule

필요한 경우 현재 프로젝트에서 사용하는 Backend Platform Rule을 참고한다.

### Feature Task Rule

- `/Users/kimseongjin/Desktop/workspace/ai-agent-lab/docs/prompts/tasks/feature.md`

문서보다 현재 프로젝트 구조를 확인할 필요가 있는 경우 실제 코드를 함께 분석한다.

단, Authentication API의 Request / Response / Error 계약은
`backend-api-spec.xlsx`를 기준으로 한다.

### 참고 문서 누락 시 처리

필수 참고 문서가 존재하지 않거나 열 수 없는 경우 작업을 임의로 진행하지 않는다.

다음 중 하나라도 확인할 수 없는 경우 작업을 일시 중지하고 누락된 문서를 보고한다.

- `login-auth.md`
- `backend-api-spec.xlsx`
- `feature.md`

문서 내용을 추측하거나 임의로 대체해서 구현하지 않는다.

---

## 4. 현재 상태

현재 Backend는 Express + JavaScript(CommonJS) 기반이다.

현재 확인된 주요 구조:

- Route
- Controller
- Service
- Repository
- SQLite
- Config
- OpenAI Integration
- GitHub Webhook
- Agent Execution

현재 Authentication Middleware는 없다.

기존 API는 인증 없이 호출되고 있다.

Authentication 관련 패키지가 존재하는 경우 현재 `package.json`을 확인하여 재사용한다.

사용자 계정 정책:

- 사용자 계정은 Backend Database에 저장한다.
- 로그인 식별자는 `email`이다.
- 별도 `username` 또는 `loginId`는 사용하지 않는다.
- 비밀번호는 Hash로 저장한다.
- 회원가입 기능은 구현하지 않는다.
- 초기 사용자는 Seed 또는 관리자용 Script로 생성한다.

---

## 5. 구현 요구사항

다음 Authentication 기능을 구현한다.

### Login

- `POST /api/auth/login`
- email/password validation
- 사용자 조회
- 활성 사용자 확인
- bcrypt 기반 password 검증
- Access Token 발급
- Refresh Token 발급
- Refresh Token DB 저장
- 사용자 로그인 시각 갱신이 설계에 포함되어 있다면 적용
- API Contract와 동일한 Response 반환

### Refresh

- `POST /api/auth/refresh`
- Refresh Token 검증
- 저장된 Token 검증
- 만료/revoke 여부 확인
- Access Token 재발급
- Refresh Token Rotation 정책은 설계/API Contract에 정의된 내용을 따른다.

### Logout

- `POST /api/auth/logout`
- API Contract에 정의된 인증 방식 적용
- Refresh Token revoke 또는 삭제
- 로그아웃 이후 기존 Refresh Token 재사용 차단

### Me

- `GET /api/auth/me`
- Access Token 인증 필요
- 인증된 사용자 조회
- API Contract와 동일한 사용자 정보 반환

---

## 6. 기술 및 구조 요구사항

현재 프로젝트 Architecture와 Naming Style을 유지한다.

필요한 계층은 현재 구조를 기준으로 구성한다.

예상 구조:

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
SQLite
```

Authentication 인증 처리는 Middleware로 분리한다.

필요 시 다음 구조를 추가할 수 있다.

```text
src/
├── routes/
│   └── auth.js
├── controllers/
│   └── authController.js
├── services/
│   └── authService.js
├── repositories/
│   └── userRepository.js
├── middleware/
│   └── authMiddleware.js
```

단, 실제 프로젝트 구조를 분석한 뒤 기존 Convention에 맞춰 결정한다.

불필요한 Architecture 변경이나 대규모 Refactoring은 하지 않는다.

---

## 7. API 계약

반드시 다음 문서를 따른다.

- `/Users/kimseongjin/Desktop/workspace/private-agent-backend/docs/backend-api-spec.xlsx`

다음을 임의로 변경하지 않는다.

- Endpoint
- HTTP Method
- Request Field
- Request Validation
- Response Field
- HTTP Status
- Error Code
- Error Message
- Authentication 여부
- Token 전달 방식

설계 문서와 API Contract가 충돌하면 임의로 판단하여 구현하지 않는다.

충돌 내용을 보고하고 작업을 중단한다.

---

## 8. Database 변경 범위

`login-auth.md` 설계를 기준으로 필요한 Authentication Table을 추가한다.

검토 대상:

- `users`
- `refresh_tokens`

사용자 테이블에는 최소한 설계에서 정의한 다음 성격의 데이터가 포함되어야 한다.

- id
- email
- password hash
- role
- active 상태
- 생성/수정 시각

Refresh Token은 원문 그대로 DB에 저장하지 않는다.

기존 Database 구조와 기존 History Table에는 영향을 주지 않는다.

현재 프로젝트의 SQLite 초기화 방식을 우선 사용한다.

별도의 Migration Framework는 임의로 도입하지 않는다.

---

## 9. 초기 관리자 계정

회원가입 기능은 구현하지 않는다.

설계 문서에 따라 초기 사용자를 생성할 수 있는 Seed 또는 관리자용 Script를 구현한다.

관리자 email/password는 코드에 하드코딩하지 않는다.

필요한 값은 환경 변수로 받는다.

예:

```text
INITIAL_ADMIN_EMAIL
INITIAL_ADMIN_PASSWORD
```

비밀번호는 저장 전에 반드시 Hash 처리한다.

동일 email이 존재하는 경우의 동작은 명확하게 처리한다.

---

## 10. 환경 변수

Authentication에 필요한 Secret 및 설정값은 환경 변수로 관리한다.

예:

```text
JWT_SECRET
ACCESS_TOKEN_EXPIRES_IN
REFRESH_TOKEN_EXPIRES_IN
INITIAL_ADMIN_EMAIL
INITIAL_ADMIN_PASSWORD
```

정확한 변수명과 값은 설계/API Contract 및 기존 `env.js` 구조를 우선한다.

Secret을 소스에 하드코딩하지 않는다.

실제 Secret 값을 Git에 추가하지 않는다.

---

## 11. Validation

API Contract에 정의된 모든 입력 Validation을 구현한다.

검토 대상:

- email required
- email format
- password required
- refreshToken required
- Authorization Header 형식

Validation 실패와 인증 실패를 구분한다.

확정되지 않은 Validation 규칙을 임의로 추가하지 않는다.

---

## 12. Error 처리

API Contract의 HTTP Status / Error Code / Message를 따른다.

최소 다음 상황을 처리한다.

- Request validation 실패
- 잘못된 email/password
- 비활성 사용자
- Access Token 없음
- Access Token 만료
- Access Token 검증 실패
- Refresh Token 없음
- Refresh Token 만료
- Refresh Token revoke
- 존재하지 않는 사용자
- 서버 내부 오류

사용자 존재 여부 등을 추측할 수 있는 민감한 정보를 인증 실패 Response에 노출하지 않는다.

---

## 13. 보안 요구사항

다음을 반드시 지킨다.

- 평문 비밀번호 저장 금지
- 일반 문자열 비교로 비밀번호 검증 금지
- Password는 bcrypt 기반 검증
- JWT Secret 하드코딩 금지
- Password 로그 출력 금지
- Access Token 로그 출력 금지
- Refresh Token 로그 출력 금지
- Refresh Token DB 원문 저장 금지
- JWT signature 검증
- JWT expiry 검증
- 비활성 사용자 접근 차단
- 인증 실패 시 내부 정보 노출 금지

---

## 14. 보호 API 적용

`login-auth.md` 및 API Contract에서 이번 단계 보호 대상으로 정의한 기존 API에
Authentication Middleware를 적용한다.

공개 API는 공개 상태를 유지한다.

예:

```text
Public
- Health
- Login
- Refresh (계약에 따라)

Protected
- Me
- Ask
- Plan
- Review
- Agent
- History
```

실제 보호 범위는 반드시 설계/API Contract를 기준으로 한다.

임의로 기존 API 전체를 보호하지 않는다.

### Client 영향 주의

기존 API에 Authentication Middleware를 적용하면
현재 인증 연동 전인 Web / Android / iOS / Telegram Server 요청이
일시적으로 `401 Unauthorized` 응답을 받을 수 있다.

Middleware 적용 전 보호 대상 Endpoint 목록과
기존 Client 영향 범위를 먼저 확인한다.

설계/API Contract에서 보호 대상으로 확정된 API는 구현하되,
문서와 실제 보호 범위가 불일치하면 임의 적용하지 않고 작업을 중단한다.

---

## 15. 변경 예정 파일

실제 프로젝트 분석 후 확정한다.

예상 범위:

- `src/index.js`
- `src/routes/auth.js`
- `src/controllers/authController.js`
- `src/services/authService.js`
- `src/repositories/userRepository.js`
- `src/middleware/authMiddleware.js`
- `src/db/sqlite.js`
- `src/config/env.js`
- `scripts/seed-admin-user.js`
- `package.json` (script 추가가 필요한 경우)

필요하지 않은 파일은 만들지 않는다.

---

## 16. 작업 제한

다음 작업은 하지 않는다.

- Web 수정
- Android 수정
- iOS 수정
- Telegram Server 수정
- README 수정
- `backend-api-spec.xlsx` 수정
- `login-auth.md` 수정
- 회원가입 구현
- 비밀번호 찾기 구현
- 소셜 로그인 구현
- 범위 밖 Refactoring
- 불필요한 Package 추가
- Git Commit
- Git Push

---

## 17. 작업 절차

다음 순서로 작업한다.

1. 필수 참고 문서 존재 여부 확인
2. `login-auth.md` 확인
3. `backend-api-spec.xlsx` 확인
4. 현재 Backend 구조 분석
5. 설계/API Contract 충돌 여부 확인
6. 기존 Client 영향 범위 확인
7. Database 변경
8. Repository 구현
9. Service 구현
10. Controller 구현
11. Route 구현
12. Authentication Middleware 구현
13. Seed Script 구현
14. 기존 보호 대상 API에 Middleware 적용
15. Validation 확인
16. Error 처리 확인
17. 테스트
18. Self Review

---

## 18. 중단하고 질문해야 하는 경우

다음 상황에서는 임의 구현하지 말고 작업을 일시 중지하고 보고한다.

- 필수 참고 문서가 존재하지 않거나 열 수 없는 경우
- 설계 문서와 API Contract가 충돌한다.
- Request/Response 계약이 불명확하다.
- Token 정책이 확정되지 않았다.
- DB 구조를 설계와 다르게 변경해야 한다.
- 기존 Architecture를 크게 변경해야 한다.
- 새로운 Package가 반드시 필요하지만 현재 의존성에 없다.
- 기존 API의 동작을 변경해야 한다.
- 보안 정책을 임의로 결정해야 한다.
- 보호 API 적용 범위가 문서에서 명확하지 않다.

누락되거나 불명확한 내용을 추측해서 구현하지 않는다.

---

## 19. 빌드 및 테스트

구현 완료 후 가능한 범위에서 다음을 수행한다.

- 서버 실행 확인
- Syntax/Runtime 오류 확인
- 기존 API 영향 확인
- Authentication API 테스트
- 잘못된 Login 테스트
- Validation 실패 테스트
- Token 없는 Protected API 테스트
- 정상 Access Token 테스트
- 만료/잘못된 Token 테스트
- Refresh 테스트
- Logout 후 Refresh Token 재사용 테스트
- Me API 테스트

기존 테스트 도구가 있으면 사용한다.

새로운 테스트 Framework는 임의로 추가하지 않는다.

---

## 20. 완료 기준

다음 조건을 모두 만족해야 한다.

- 필수 참고 문서가 모두 확인되었다.
- `login-auth.md` 설계가 구현되었다.
- `backend-api-spec.xlsx` API Contract와 구현이 일치한다.
- Login이 정상 동작한다.
- Refresh가 정상 동작한다.
- Logout이 정상 동작한다.
- Me가 정상 동작한다.
- Password가 Hash 저장된다.
- Refresh Token이 안전하게 저장된다.
- Authentication Middleware가 동작한다.
- 정의된 기존 API가 보호된다.
- Validation이 적용된다.
- Error Response가 API Contract와 일치한다.
- 기존 기능에 불필요한 변경이 없다.
- 서버가 정상 실행된다.

---

## 21. 완료 보고

작업 완료 후 다음 내용을 보고한다.

1. 수정한 파일
2. 추가한 파일
3. 삭제한 파일
4. Database 변경 내용
5. 환경 변수 추가 내용
6. 구현한 API
7. Middleware 적용 API
8. Seed Script 사용 방법
9. 테스트 결과
10. 설계와 다른 부분
11. API Contract와 다른 부분
12. 구현하지 못한 항목
13. 추가 확인이 필요한 사항
