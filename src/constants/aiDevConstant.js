const AI_DEV_AGENT_TYPES = {
  CURSOR: "cursor",
  CODEX: "codex",
  CLAUDE: "claude",
  GEMINI: "gemini",
};

const AI_DEV_TASK_TYPES = {
  FEATURE: "feature",
  REVIEW: "review",
  REFACTOR: "refactor",
  BUGFIX: "bugfix",
};

const AI_DEV_WORKSPACES = {
  BACKEND: "backend",
  FRONT: "front",
  SERVER: "server",
};

const VALID_AI_DEV_AGENT_TYPES = Object.values(AI_DEV_AGENT_TYPES);
const VALID_AI_DEV_TASK_TYPES = Object.values(AI_DEV_TASK_TYPES);
const VALID_AI_DEV_WORKSPACES = Object.values(AI_DEV_WORKSPACES);

module.exports = {
  AI_DEV_AGENT_TYPES,
  AI_DEV_TASK_TYPES,
  AI_DEV_WORKSPACES,
  VALID_AI_DEV_AGENT_TYPES,
  VALID_AI_DEV_TASK_TYPES,
  VALID_AI_DEV_WORKSPACES,
};
