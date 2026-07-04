const apiService = require("../services/apiService");

const getPing = (req, res) => {
  const result = apiService.getPing();
  res.json(result);
};

const askQuestion = async (req, res) => {
  const question = req.body.question;

  if (!question) {
    return res.status(400).json({ error: "질문이 필요합니다." });
  }

  const result = await apiService.askQuestion(question);
  res.json(result);
};

const generatePlan = async (req, res) => {
  const topic = req.body.topic;

  if (!topic) {
    return res.status(400).json({ error: "주제가 필요합니다." });
  }

  const result = await apiService.generatePlan(topic);
  res.json(result);
};

const reviewCode = async (req, res) => {
  const reviewCode = req.body.reviewCode;

  if (!reviewCode) {
    return res.status(400).json({ error: "리뷰할 코드가 필요합니다." });
  }

  // 여기서 OpenAI API를 호출하여 코드 리뷰를 수행하는 로직을 작성합니다.
  // 예시로, 코드 리뷰 결과를 반환하는 부분을 작성합니다.
  const reviewResult = await apiService.reviewCode(reviewCode);

  res.json(reviewResult);
};

module.exports = {
  getPing,
  askQuestion,
  generatePlan,
  reviewCode,
};
