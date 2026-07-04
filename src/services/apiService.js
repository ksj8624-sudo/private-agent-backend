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

const reviewCode = async (reviewCode) => {
  // 여기서 OpenAI API를 호출하여 코드 리뷰를 수행하는 로직을 작성합니다.
  // 예시로, 코드 리뷰 결과를 반환하는 부분을 작성합니다.
  const result = await openaiService.reviewCode(reviewCode);

  return {
    ok: true,
    reviewCode,
    answer: result.answer,
  };
};

module.exports = {
  getPing,
  askQuestion,
  generatePlan,
  reviewCode,
};
