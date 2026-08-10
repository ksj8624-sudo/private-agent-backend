const cursorPrompt = require("../prompts/dev/cursorPrompt");
const {
  AI_DEV_TASK_TYPES,
  AI_DEV_AGENT_TYPES,
} = require("../constants/aiDevConstant");
const cursorAgentService = require("./aiAgent/cursorAgentService");
const codexAgentService = require("./aiAgent/codexAgentService");
const claudeAgentService = require("./aiAgent/claudeAgentService");
const agentHistoryRepository = require("../repositories/agentHistoryRepository");

const getCursorMode = (taskType) => {
  if (taskType === AI_DEV_TASK_TYPES.REVIEW) {
    return "ask";
  }

  return null;
};

const buildPrompt = ({ taskType, task }) => {
  switch (taskType) {
    case AI_DEV_TASK_TYPES.FEATURE:
      return cursorPrompt.buildFeaturePrompt(task);

    case AI_DEV_TASK_TYPES.REFACTOR:
      return cursorPrompt.buildRefactorPrompt(task);

    case AI_DEV_TASK_TYPES.BUGFIX:
      return cursorPrompt.buildBugfixPrompt(task);

    case AI_DEV_TASK_TYPES.REVIEW:
      return cursorPrompt.buildReviewPrompt(task);

    default:
      throw new Error("Unsupported AI dev type.");
  }
};

const executeAgent = async ({ agent, workspace, taskType, prompt }) => {
  switch (agent) {
    case AI_DEV_AGENT_TYPES.CURSOR:
      return cursorAgentService.execute({
        workspace,
        prompt,
        mode: getCursorMode(taskType),
      });

    case AI_DEV_AGENT_TYPES.CODEX:
      return codexAgentService.execute({
        workspace,
        prompt,
      });
    case AI_DEV_AGENT_TYPES.CLAUDE:
      return claudeAgentService.execute({
        workspace,
        prompt,
      });

    default:
      throw new Error("Unsupported AI Agent.");
  }
};

const saveHistory = ({
  agent,
  workspace,
  taskType,
  task,
  result,
  status,
  durationMs,
  errorMessage,
}) => {
  agentHistoryRepository.save({
    agentType: agent,
    workspace,
    taskType,
    task,
    result,
    status,
    durationMs,
    errorMessage,
  });
  console.log(`save success`);
};

const requestAgent = async ({ agent, workspace, taskType, task }) => {
  const startedAt = Date.now();

  let result;
  try {
    let prompt = buildPrompt({ taskType, task });
    result = await executeAgent({ agent, workspace, taskType, prompt });

    saveHistory({
      agent,
      workspace,
      taskType,
      task,
      result,
      status: "success",
      durationMs: Date.now() - startedAt,
      errorMessage: null,
    });
  } catch (error) {
    saveHistory({
      agent,
      workspace,
      taskType,
      task,
      result: null,
      status: "fail",
      durationMs: Date.now() - startedAt,
      errorMessage: error.message,
    });

    throw error;
  }

  return result;
};

const getAgentHistories = ({ limit = 20 } = {}) => {
  return agentHistoryRepository.findRecent(limit);
};

module.exports = {
  requestAgent,
  getAgentHistories,
};
