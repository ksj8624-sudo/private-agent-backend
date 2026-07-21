const cursorPrompt = require("../prompts/dev/cursorPrompt");
const {
  AI_DEV_TASK_TYPES,
  AI_DEV_AGENT_TYPES,
} = require("../constants/aiDevConstant");
const cursorAgentService = require("./cursorAgentService");
const codexAgentService = require("./codexAgentService");

const getCursorMode = (taskType) => {
  if (taskType === AI_DEV_TASK_TYPES.REVIEW) {
    return "ask";
  }

  return null;
};

const requestAgent = async ({ agent, workspace, taskType, task }) => {
  let prompt;
  console.log(`agent service ${agent} ${workspace} ${taskType} ${task}`);
  switch (taskType) {
    case AI_DEV_TASK_TYPES.FEATURE:
      prompt = cursorPrompt.buildFeaturePrompt(taskType);
      break;
    case AI_DEV_TASK_TYPES.REFACTOR:
      prompt = cursorPrompt.buildRefactorPrompt(taskType);
      break;
    case AI_DEV_TASK_TYPES.BUGFIX:
      prompt = cursorPrompt.buildBugfixPrompt(taskType);
      break;
    case AI_DEV_TASK_TYPES.REVIEW:
      prompt = cursorPrompt.buildReviewPrompt(taskType);
      break;
    default:
      throw new Error("Unsupported AI dev type.");
  }

  let result;

  console.log(`${agent} ${taskType}`);
  switch (agent) {
    case AI_DEV_AGENT_TYPES.CURSOR:
      result = await cursorAgentService.execute({
        workspace,
        prompt,
        mode: getCursorMode(taskType),
      });
      break;
    case AI_DEV_AGENT_TYPES.CODEX:
      result = await codexAgentService.execute({
        workspace,
        prompt,
      });
      break;
    default:
      throw new Error("Unsupported AI Agent");
  }

  return result;
};

module.exports = {
  requestAgent,
};
