const openAiService = require("./openaiService");
const { buildReviewPrompt } = require("../prompts/ai/reviewPrompt");

const reviewCode = async (diff) => {
  if (!diff) {
    throw new Error("Diff is required for code review.");
  }

  const prompt = buildReviewPrompt(diff);

  const review = await openAiService.askQuestion(prompt);
  return review;
};

module.exports = {
  reviewCode,
};
