const AI_DEV_TYPES = {
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

const VALID_AI_DEV_TYPES = Object.values(AI_DEV_TYPES);
const VALID_AI_DEV_WORKSPACES = Object.values(AI_DEV_WORKSPACES);

module.exports = {
  AI_DEV_TYPES,
  AI_DEV_WORKSPACES,
  VALID_AI_DEV_TYPES,
  VALID_AI_DEV_WORKSPACES,
};
