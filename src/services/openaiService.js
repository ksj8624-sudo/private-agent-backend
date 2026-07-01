const OpenAI = require("openai");
const config = require("../config/env");
const apiKey = config.OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey,
});

const ask = async (question) => {
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
  } catch (error) {
    console.error("Error while asking question:", error);
    throw new Error(
      error.message || "An error occurred while asking the question.",
    );
  }

  return {
    answer: response.choices[0].message.content.trim(),
  };
};

module.exports = {
  ask,
};
