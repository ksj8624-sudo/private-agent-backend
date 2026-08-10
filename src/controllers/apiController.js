const openAiService = require("../services/openaiService");
const healthService = require("../services/healthService");
const reviewService = require("../services/reviewService");

const getPing = (req, res) => {
  const result = healthService.getPing();
  res.json(result);
};

const askQuestion = async (req, res) => {
  const question = req.body.question;

  if (!question) {
    return res.status(400).json({ error: "질문이 필요합니다." });
  }

  const result = await openAiService.askQuestion(question);
  res.json(result);
};

const generatePlan = async (req, res) => {
  const topic = req.body.topic;
  console.log(`topic : ${topic}`);
  if (!topic) {
    return res.status(400).json({ error: "주제가 필요합니다." });
  }

  const result = await openAiService.generatePlan(topic);
  console.log(`result = ${result.answer}`);
  return res.json(result);
};

const reviewCode = async (req, res) => {
  const reviewCode = req.body.reviewCode;

  if (!reviewCode) {
    return res.status(400).json({ error: "리뷰할 코드가 필요합니다." });
  }

  const result = await reviewService.reviewCode(reviewCode);

  res.json(result);
};

module.exports = {
  getPing,
  askQuestion,
  generatePlan,
  reviewCode,
};
