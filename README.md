# 🤖 Private Agent Backend

AI 기반 개발 에이전트의 Backend 서버입니다.

GitHub Pull Request를 자동으로 분석하여 OpenAI로 코드 리뷰를 수행하고,
GitHub PR Comment와 Telegram으로 리뷰 결과를 전달합니다.

---

## Features

### AI

- AI Question Answering
- Development Plan Generator
- AI Code Review

### GitHub

- GitHub Webhook
- Pull Request Event Processing
- Pull Request Diff Fetch
- AI Review
- GitHub PR Comment

### Notification

- Telegram Notification

---

## Architecture

```
GitHub Pull Request
        │
        ▼
 GitHub Webhook
        │
        ▼
Private Agent Backend
        │
        ├──────────────┐
        ▼              ▼
GitHub API       OpenAI API
(Diff Fetch)     (Code Review)
        │              │
        └──────┬───────┘
               ▼
        Review Service
               │
        ┌──────┴──────┐
        ▼             ▼
GitHub Comment   Telegram
```

---

## Tech Stack

- Node.js
- Express
- OpenAI API
- GitHub Webhook
- GitHub REST API
- Telegram Bot API

---

## Project Structure

```
src
├── controllers
├── routes
├── services
├── prompts
├── messages
└── utils
```

---

## Current Status

### ✅ Completed

- GitHub Webhook
- Pull Request Diff Fetch
- AI Code Review
- GitHub PR Comment
- Telegram Notification

### 🚧 Next

- Dashboard
- Cursor Integration
- Multi Repository Support
- Review History
