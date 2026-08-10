# 🤖 Private Agent Backend

AI 기반 개인 개발 에이전트의 Backend 서버입니다.

OpenAI를 통한 질의/개발 계획/코드 리뷰, GitHub Pull Request 자동 리뷰,
Cursor / Codex / Claude CLI 기반 AI 에이전트 실행을 하나의 Express 서버에서 제공합니다.

---

## Project Overview

**Private Agent**는 개발자의 반복 작업(질의응답, 계획 수립, 코드 리뷰, PR 리뷰, 실제 코드 작업 실행)을
AI에게 위임하기 위한 개인용 에이전트 시스템입니다.

**private-agent-backend**는 이 시스템의 중심 서버로 다음 역할을 담당합니다.

- OpenAI API를 이용한 질의응답 / 개발 계획 생성 / 코드 리뷰 처리
- GitHub Webhook을 수신해 Pull Request를 자동으로 분석하고, 리뷰 결과를 PR 코멘트와 Telegram으로 전달
- Cursor / Codex / Claude CLI를 로컬 워크스페이스에서 직접 실행시키는 AI 에이전트 실행기(Executor) 역할
- 위 모든 작업의 실행 이력을 SQLite에 저장하고 조회 API를 제공

---

## Features

실제 코드에 구현되어 있고 Route로 등록되어 호출 가능한 기능만 기재합니다.

### AI

- **AI Ask** — 질문을 OpenAI(gpt-3.5-turbo)에 전달하고 답변을 반환 (`POST /api/ask`)
- **AI Plan** — 주제(topic) 기반 개발 계획 생성 (`POST /api/plan`)
- **AI Review** — 코드/diff를 즉시 리뷰 (`POST /api/review`, 이력 저장 없음)

### GitHub Integration

- **GitHub Webhook 수신** (`POST /github/webhook`)
- **Pull Request Diff Fetch** — GitHub REST API로 diff 조회
- **AI 기반 PR 자동 리뷰** — 위 diff를 OpenAI로 리뷰
- **GitHub PR Comment 등록** — 리뷰 결과를 PR에 코멘트로 작성

### Telegram Integration

- **Telegram Notification** — PR 리뷰 완료 시 결과를 Telegram Chat으로 단방향 발송
- **Telegram Help API** — 명령어 안내 정보를 반환하는 정적 API (`GET /telegram/help`)
- 대화형 Telegram Bot 명령 처리는 별도 `private-agent-server` 프로젝트에서 담당합니다.
- 본 Backend는 Telegram 알림 발송과 Help API를 제공합니다.

### AI Agent Execution

- **Cursor / Codex / Claude Agent 실행** — `child_process`로 로컬 CLI를 실행하고 결과를 반환 (`POST /dev/agent`)
- **Workspace 선택** — `backend` / `front` / `server` 3개 워크스페이스 중 선택하여 실행
- **Task Type 기반 프롬프트** — `feature` / `refactor` / `bugfix` / `review` 유형에 따라 `.cursor/prompts/*.md` 템플릿으로 프롬프트 구성 (Cursor/Codex/Claude 공통)

### History

- **Review History** — GitHub Webhook을 통해 생성된 리뷰 결과를 SQLite에 저장하고 조회 (`GET /reviewHistory`)
- **Agent History** — Cursor·Codex·Claude Agent 실행 요청과 결과를 SQLite에 저장하고 조회 (`GET /dev/agent/history`)
  - Agent, Workspace, Task Type, 요청 내용
  - 성공 여부, 실행 결과, 소요 시간, 실행 시각

---

## Architecture

```
                              ┌─────────────────────────┐
                              │        Express App        │
                              │      (src/index.js)       │
                              └─────────────┬──────────────┘
                                            │
   ┌───────────────┬────────────────┬──────┴───────┬────────────────┬───────────────┐
   ▼               ▼                ▼               ▼                ▼               ▼
GET /health   POST /api/ask    POST            GET             POST /dev/agent   GET /reviewHistory
GET /api/ping POST /api/plan   /github/webhook  /telegram/help  GET /dev/agent/history
GET /         POST /api/review
   │               │                │               │                │               │
   ▼               ▼                ▼               ▼                ▼               ▼
healthService  openaiService   githubWebhookService (정적 응답)   aiDevService   reviewHistoryService
               reviewService        │                                 │           agentHistoryRepository
                    │                │                                 │               │
                    │                ├─► githubApiService ─► GitHub REST API           ▼
                    │                │      (Diff Fetch / PR Comment)              SQLite
                    │                ├─► reviewService ─► openaiService ─► OpenAI API  (data/agent.db)
                    │                ├─► telegramService ─► Telegram Bot API
                    │                └─► reviewHistoryService ─► SQLite (review_histories)
                    │
                    └─► OpenAI API (gpt-3.5-turbo)

aiDevService (POST /dev/agent)
   ├─► cursorAgentService ─┐
   ├─► codexAgentService  ─┼─► cliExecutor (child_process.spawn) ─► Cursor / Codex / Claude CLI
   ├─► claudeAgentService ─┘       (config/workspaces.js로 매핑된 워크스페이스 경로에서 실행)
   └─► agentHistoryRepository ─► SQLite (agent_histories)
```

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express 5
- **Language**: JavaScript (CommonJS)
- **Database**: SQLite (`better-sqlite3`)
- **AI**: OpenAI API (`openai`, 모델은 `gpt-3.5-turbo`로 코드에 고정)
- **CLI Agent 실행**: `child_process.spawn`으로 Cursor / Codex / Claude CLI 직접 실행 (별도 SDK 미사용)
- **GitHub 연동**: GitHub REST API (`fetch` 직접 호출, SDK 미사용)
- **Telegram 연동**: Telegram Bot HTTP API (`fetch` 직접 호출)
- **기타**: `cors`, `dotenv`, `nodemon`(dev)

---

## Project Structure

사용되지 않는 파일(빈 파일, 어디서도 import되지 않는 파일)은 제외했습니다.

```
src
├── config
│   ├── env.js              # 환경 변수 로드
│   └── workspaces.js       # Agent 실행 워크스페이스 경로 매핑
├── constants
│   └── aiDevConstant.js    # Agent/Workspace/TaskType Enum
├── controllers
│   ├── apiController.js
│   ├── devController.js
│   ├── githubController.js
│   ├── healthController.js
│   ├── reviewHistoryController.js
│   └── telegramController.js
├── db
│   └── sqlite.js           # SQLite 연결 및 테이블 생성
├── messages
│   └── reviewMessage.js    # Telegram 리뷰 메시지 포맷
├── prompts
│   ├── ai
│   │   ├── planPrompt.js
│   │   └── reviewPrompt.js
│   └── dev
│       └── cursorPrompt.js # .cursor/prompts/*.md 템플릿 로드
├── repositories
│   ├── agentHistoryRepository.js
│   └── reviewHistoryRepository.js
├── routes
│   ├── api.js
│   ├── dev.js
│   ├── github.js
│   ├── health.js
│   ├── reviewHistory.js
│   └── telegram.js
├── services
│   ├── aiAgent
│   │   ├── claudeAgentService.js
│   │   ├── cliExecutor.js      # child_process 실행 공통 로직
│   │   ├── codexAgentService.js
│   │   └── cursorAgentService.js
│   ├── aiDevService.js         # Agent 실행 오케스트레이션
│   ├── githubApiService.js
│   ├── githubWebhookService.js
│   ├── healthService.js
│   ├── openaiService.js
│   ├── reviewHistoryService.js
│   ├── reviewService.js
│   └── telegramService.js
└── index.js                    # 앱 진입점, Route 등록
```

---

## API Overview

전체 Request/Response 상세 명세는 [`docs/backend-api-spec.xlsx`](./docs/backend-api-spec.xlsx)를 참고하세요.
아래는 영역별 등록 API 목록입니다. 별도 표기가 없는 한 인증은 요구하지 않습니다.

### Health

| Method | Endpoint    |
| ------ | ----------- |
| GET    | `/`         |
| GET    | `/health`   |
| GET    | `/api/ping` |

### AI

| Method | Endpoint      |
| ------ | ------------- |
| POST   | `/api/ask`    |
| POST   | `/api/plan`   |
| POST   | `/api/review` |

### GitHub

| Method | Endpoint          |
| ------ | ----------------- |
| POST   | `/github/webhook` |

### Telegram

| Method | Endpoint         |
| ------ | ---------------- |
| GET    | `/telegram/help` |

### Agent

| Method | Endpoint     |
| ------ | ------------ |
| POST   | `/dev/agent` |

### History

| Method | Endpoint             |
| ------ | -------------------- |
| GET    | `/dev/agent/history` |
| GET    | `/reviewHistory`     |

---

## Getting Started

### 설치

```bash
npm install
```

### 환경 변수

`.env` 파일에 아래 값을 설정합니다(실제 값은 각자 환경에 맞게 채워야 하며, 저장소에는 포함되어 있지 않습니다).

| 변수명                       | 필수 여부                       | 용도                                      |
| ---------------------------- | ------------------------------- | ----------------------------------------- |
| `PORT`                       | 선택 (기본값 3000)              | 서버 포트                                 |
| `OPENAI_API_KEY`             | AI Ask/Plan/Review 사용 시 필수 | OpenAI API 인증                           |
| `GITHUB_TOKEN`               | GitHub PR Comment 사용 시 필수  | GitHub REST API 인증                      |
| `TELEGRAM_BOT_TOKEN`         | Telegram 알림 사용 시 필수      | Telegram Bot API 인증                     |
| `TELEGRAM_CHAT_ID`           | Telegram 알림 사용 시 필수      | 알림을 받을 Chat ID                       |
| `PRIVATE_AGENT_BACKEND_PATH` | 선택                            | Agent 실행 시 `backend` 워크스페이스 경로 |
| `PRIVATE_AGENT_SERVER_PATH`  | 선택                            | Agent 실행 시 `server` 워크스페이스 경로  |
| `PRIVATE_AGENT_FRONT_PATH`   | 선택                            | Agent 실행 시 `front` 워크스페이스 경로   |

Agent 실행 기능(`POST /dev/agent`)을 사용하려면 `cursor`, `codex`, `claude` CLI가 서버 실행 환경의 PATH에 설치되어 있어야 합니다.

### 실행

```bash
# 개발 모드 (nodemon)
npm run dev

# 프로덕션 모드
npm start
```

기본적으로 `http://localhost:3000`에서 서버가 실행됩니다. `scripts/api-test.sh`로 일부 API를 간단히 점검할 수 있습니다.

---

## Current Implementation

### Implemented

- AI Ask / Plan / Review
- GitHub Webhook 기반 PR 자동 리뷰
- GitHub PR Comment
- Telegram 리뷰 결과 알림
- Cursor / Codex / Claude CLI Agent 실행
- Review History 저장 및 조회
- Agent History 저장 및 조회
- Workspace 및 Task Type 기반 Agent 실행

### In Progress / Planned

- Authentication
- Error Response 표준화
- Prompt Workflow 통합
- Workspace 확장

---

## Roadmap

아래 항목은 현재 코드에 구현되어 있지 않으며, 향후 개발 예정 사항입니다.

- User Management
- Dashboard (Frontend)
- 대화형 Telegram Bot 명령 처리 (`/ask`, `/plan`, `/review` 등 실시간 명령 리스닝)
- `gemini` Agent 실행 지원 완성
- Workspace 동적 등록/관리 (현재는 `backend`/`front`/`server` 3개 고정 워크스페이스만 지원)
- Multi Repository Support (GitHub)
- 전역 Error Handler 도입 및 API 응답 형식 표준화
- n8n Workflow 연동
- MCP(Model Context Protocol) 연동
- Web / Android / iOS 공통 인증 연동
- Client 간 Agent History 및 기능 동기화

---

## Related Projects

- **private-agent-server**
  — Telegram Bot 서버
  - Backend API 호출
  - Agent 실행 요청
- **ai-agent-lab**
  — React + TypeScript 기반 Web Client
- **private-agent**
  — Kotlin 기반 Android Client
- **PrivateAgent**
  — SwiftUI 기반 iOS Client
