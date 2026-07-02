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

module.exports = {
  getPing,
  askQuestion,
  generatePlan,
};
