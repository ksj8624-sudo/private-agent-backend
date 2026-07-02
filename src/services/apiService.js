const openaiService = require("./openaiService");

const getPing = (req, res) => {
  return { message: "pong" };
};

const askQuestion = async (question) => {
  const result = await openaiService.askQuestion(question);
  return {
    ok: true,
    question,
    answer: result.answer,
  };
};

const generatePlan = async (topic) => {
  const result = await openaiService.generatePlan(topic);
  return {
    ok: true,
    topic,
    answer: result.answer,
  };
};

module.exports = {
  getPing,
  askQuestion,
  generatePlan,
};
