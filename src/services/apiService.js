const openaiService = require("./openaiService");

const getPing = (req, res) => {
  return { message: "pong" };
};

const askQuestion = async (question) => {
  const result = await openaiService.ask(question);
  return {
    ok: true,
    question,
    answer: result.answer,
  };
};

module.exports = {
  getPing,
  askQuestion,
};
