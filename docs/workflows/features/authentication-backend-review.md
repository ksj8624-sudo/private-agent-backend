# Authentication Backend Review

## 1. 작업 목표

Private Agent Backend Authentication 구현을 리뷰한다.

---

## 2. 수정 대상 프로젝트

- /Users/kimseongjin/Desktop/workspace/private-agent-backend

---

## 3. 참고 문서

반드시 아래 문서를 먼저 확인한 후 리뷰를 진행한다.

### Review Rule

- /Users/kimseongjin/Desktop/workspace/ai-agent-lab/docs/prompts/tasks/review.md

### Feature Workflow

- /Users/kimseongjin/Desktop/workspace/private-agent-backend/docs/workflows/features/authentication-backend-feature.md

### Authentication Design

- /Users/kimseongjin/Desktop/workspace/ai-agent-lab/docs/designs/login-auth.md

### API Contract

- /Users/kimseongjin/Desktop/workspace/private-agent-backend/docs/api/backend-api-spec.xlsx

---

## 4. Review 대상

이번 Authentication Feature에서 수정된 파일만 대상으로 리뷰한다.

다음 기능을 포함한다.

- Login
- Refresh
- Logout
- Me
- JWT Middleware
- User Repository
- Refresh Token Repository
- SQLite 변경
- Seed Script

---

## 5. 중점 Review 항목

Authentication Feature의 특성을 고려하여 다음 항목을 중점적으로 검토한다.

- 설계(login-auth.md)와 구현 일치 여부
- API Contract(backend-api-spec.xlsx)와 구현 일치 여부
- Request / Response / Validation / Error 계약 준수 여부
- JWT 및 Refresh Token 보안
- Middleware 적용 범위
- SQLite 및 Repository 구조
- Architecture(Route → Controller → Service → Repository) 준수 여부
- 기존 기능 영향 여부
- 버그 가능성
- 예외 처리
- 중복 코드
- 네이밍
- 유지보수성

---

## 6. 완료 기준

Review 결과를 다음 형식으로 작성한다.

- Critical
- Major
- Minor
- Good
- Summary

Critical이 없는 경우에는 반드시
"Critical 없음"을 명시한다.

Summary에는 다음 내용을 반드시 포함한다.

- 설계와 구현 일치 여부
- API Contract 일치 여부
- Authentication Architecture 평가
- 보안 평가
- 최종 평가
