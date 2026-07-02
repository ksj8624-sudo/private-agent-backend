const OpenAI = require("openai");
const config = require("../config/env");
const apiKey = config.OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey,
});

const askQuestion = async (question) => {
  try {
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
  const prompt = `너는 개발 계획을 세워주는 시니어 개발 리더야.
      아래 주제에 대해 실행 가능한 개발 계획을 작성해줘.

      주제:
      ${topic}

      응답 형식:
      1. 목표
      2. 구현 단계
      3. 필요한 파일/모듈
      4. 테스트 방법
      5. 주의할 점

      답변은 한국어로, 너무 길지 않게 정리해줘.
  `;
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
};
