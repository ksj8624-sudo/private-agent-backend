const cursorPrompt = require("../prompts/dev/cursorPrompt");
const { AI_DEV_TYPES } = require("../constants/aiDevConstant");
const cursorAgentService = require("./cursorAgentService");

const getCursorMode = (type) => {
  if (type === AI_DEV_TYPES.REVIEW) {
    return "ask";
  }

  return "agent";
};

const requestCursor = async ({ type, task }) => {
  let prompt;
  switch (type) {
    case AI_DEV_TYPES.FEATURE:
      prompt = cursorPrompt.buildFeaturePrompt(task);
      break;
    case AI_DEV_TYPES.REFACTOR:
      prompt = cursorPrompt.buildRefactorPrompt(task);
      break;
    case AI_DEV_TYPES.BUGFIX:
      prompt = cursorPrompt.buildBugfixPrompt(task);
      break;
    case AI_DEV_TYPES.REVIEW:
      prompt = cursorPrompt.buildReviewPrompt(task);
      break;
    default:
      throw new Error("Unsupported AI dev type.");
  }

  const result = await cursorAgentService.execute({
    prompt,
    mode: getCursorMode(type),
  });
  return result;
};

module.exports = {
  requestCursor,
};
