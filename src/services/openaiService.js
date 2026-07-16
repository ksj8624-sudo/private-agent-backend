const OpenAI = require("openai");
const config = require("../config/env");
const { buildPlanPrompt } = require("../prompts/ai/planPrompt");
const apiKey = config.OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey,
});

const askQuestion = async (question) => {
  try {
    console.log(`openAi key : ${openai.apiKey}`);
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: question,
        },
      ],
    });

    return {
      ok: true,
      question,
      answer: response.choices[0].message.content.trim(),
    };
  } catch (error) {
    console.error("Error while asking question:", error);
    throw new Error(
      error.message || "An error occurred while asking the question.",
    );
  }
};

const generatePlan = async (topic) => {
  const prompt = buildPlanPrompt(topic);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "너는 개발 계획을 잘게 쪼개서 설명하는 개발 멘토다.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return {
      ok: true,
      topic,
      answer: response.choices[0].message.content.trim(),
    };
  } catch (error) {
    console.error("Error while generating plan:", error);
    throw new Error(
      error.message || "An error occurred while generating the plan.",
    );
  }
};

const reviewCode = async (code) => {
  const prompt = `너는 시니어 개발자다.
    아래 코드를 리뷰해줘.

    1. 장점
    2. 개선점
    3. 버그 가능성
    4. 리팩터링 제안

    코드:

    ${code}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "너는 개발 계획을 잘게 쪼개서 설명하는 개발 멘토다.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return {
      answer: response.choices[0].message.content.trim(),
    };
  } catch (error) {
    console.error("Error while generating plan:", error);
    throw new Error(
      error.message || "An error occurred while generating the plan.",
    );
  }
};

module.exports = {
  askQuestion,
  generatePlan,
  reviewCode,
};
