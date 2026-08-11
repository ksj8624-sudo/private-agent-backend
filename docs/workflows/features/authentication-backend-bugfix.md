# Authentication Backend Bugfix

## 1. 작업 목표

Authentication Backend 코드 리뷰에서 확인된 Major Issue를 수정한다.

이번 작업은 새로운 기능 추가나 범위 밖 Refactoring이 목적이 아니다.

Review Report에서 확인된 Major Issue만 최소 범위로 수정하고
Regression Test까지 수행한다.

---

## 2. 수정 대상 프로젝트

- /Users/kimseongjin/Desktop/workspace/private-agent-backend

---

## 3. 참고 문서

작업 전에 반드시 다음 문서를 확인한다.

### Bugfix Task Rule

- /Users/kimseongjin/Desktop/workspace/ai-agent-lab/docs/prompts/tasks/bugfix.md

### Authentication Design

- /Users/kimseongjin/Desktop/workspace/ai-agent-lab/docs/designs/login-auth.md

### API Contract

- /Users/kimseongjin/Desktop/workspace/private-agent-backend/docs/api/backend-api-spec.xlsx

### Feature Workflow

- /Users/kimseongjin/Desktop/workspace/private-agent-backend/docs/workflows/features/authentication-backend-feature.md

### Review Report

- /Users/kimseongjin/Desktop/workspace/private-agent-backend/docs/workflows/review/authentication-review-result.md

위 문서 중 하나라도 존재하지 않거나 읽을 수 없는 경우
임의로 대체하거나 추측하지 않고 작업을 중단하고 보고한다.

---

## 4. 수정 대상 Issue

이번 작업에서는 아래 Major Issue 2건만 수정한다.

### Major #1 - Refresh Token Rotation Transaction

현재 Refresh Token Rotation 과정에서

1. 기존 Refresh Token revoke
2. 새 Refresh Token 저장

이 각각 별도의 DB 쓰기로 수행된다.

두 작업 사이에 실패할 경우 기존 Token은 폐기되었지만
새 Token이 저장되지 않는 비정상 상태가 발생할 수 있다.

요구사항:

- Refresh Token revoke와 새 Refresh Token 저장을 하나의 Transaction으로 처리한다.
- 중간 실패 시 전체 작업을 rollback한다.
- API Request / Response 계약은 변경하지 않는다.

---

### Major #2 - Access Token 사용자 상태 재검증

현재 Authentication Middleware는 JWT의 signature / expiry만 검증한 뒤
JWT payload를 `req.user`에 사용한다.

설계 문서의 인증 흐름에서는 JWT 검증 이후 실제 사용자 조회 및
활성 상태 확인을 수행하도록 정의되어 있다.

현재 방식에서는 이미 발급된 Access Token이 있는 사용자가
삭제되거나 비활성화되어도 Token 만료 전까지 일부 보호 API에 접근할 수 있다.

요구사항:

- Access Token 검증 후 사용자 정보를 DB에서 조회한다.
- 존재하지 않는 사용자는 인증 실패 처리한다.
- `is_active = 0` 사용자는 인증 실패 처리한다.
- 인증 성공 시 실제 DB User 기준으로 `req.user`를 구성한다.
- `/api/auth/me`와 다른 보호 API의 사용자 검증 수준을 일치시킨다.
- API Contract의 Response/Error 계약은 변경하지 않는다.

---

## 5. 수정 제외 항목

Review Report의 Minor Issue는 이번 작업에서 수정하지 않는다.

다음은 범위 제외다.

- AuthError 중복 코드 정리
- sync / async 함수 스타일 통일
- AuthError class 스타일 변경
- JWT Secret fail-fast 구조 개선
- login / last_login_at Transaction 개선

필요하면 추후 Refactor 또는 별도 Bugfix에서 처리한다.

---

## 6. 변경 예상 범위

주요 검토 대상:

- src/services/authService.js
- src/repositories/userRepository.js
- src/middleware/authMiddleware.js

실제 Root Cause 해결에 필요한 경우 관련 파일을 추가로 수정할 수 있다.

단, 변경 범위가 크게 확장되는 경우 작업을 중단하고 보고한다.

---

## 7. API Contract

다음 문서를 최종 API 계약 기준으로 사용한다.

- /Users/kimseongjin/Desktop/workspace/private-agent-backend/docs/api/backend-api-spec.xlsx

다음을 변경하지 않는다.

- Endpoint
- HTTP Method
- Request
- Response
- Validation
- Error Code
- HTTP Status

API Contract 변경이 필요한 경우 작업을 중단하고 보고한다.

---

## 8. 작업 제한

- 새로운 Feature 추가 금지
- Minor Issue 수정 금지
- 범위 밖 Refactoring 금지
- Architecture 임의 변경 금지
- API Contract 수정 금지
- Design 문서 수정 금지
- 불필요한 Package 추가 금지
- Git Commit 금지
- Git Push 금지

---

## 9. 테스트

### Major #1

다음을 확인한다.

- 정상 Refresh 성공
- 기존 Refresh Token revoke
- 새 Refresh Token 저장
- 기존 Token 재사용 401
- Transaction 중 실패 시 DB 상태 rollback 확인

### Major #2

다음을 확인한다.

- 정상 Access Token 보호 API 접근 성공
- 존재하지 않는 User Token 접근 실패
- 비활성 User Token 접근 실패
- `/api/auth/me` 동작 유지
- `/api/ask`
- `/api/plan`
- `/api/review`
- `/reviewHistory`

기존 Authentication 테스트도 다시 수행한다.

- Login
- Refresh
- Logout
- Me

Regression이 있으면 완료로 판단하지 않는다.

---

## 10. 완료 기준

다음 조건을 모두 만족해야 한다.

- Major #1 해결
- Major #2 해결
- API Contract 변경 없음
- Design 변경 없음
- 기존 Authentication API 정상 동작
- 기존 보호 API 정상 동작
- Regression 없음
- Minor Issue는 수정하지 않음

---

## 11. 완료 보고

작업 완료 후 다음 내용을 보고한다.

1. 수정한 Issue
2. Root Cause
3. 수정한 파일
4. 추가한 파일
5. 삭제한 파일
6. 변경 내용
7. API Contract 변경 여부
8. Design 변경 여부
9. 테스트 결과
10. Regression Test 결과
11. 해결된 Review 항목
12. 미해결 Review 항목
13. 추가 확인 사항

Review Issue 해결 여부는 명확하게 작성한다.

예:

- Major #1 해결
- Major #2 해결
- Minor #1 보류
- Minor #2 범위 제외
