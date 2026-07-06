const TelegramBot = require("node-telegram-bot-api");
const { buildReviewMessage } = require("../messages/reviewMessage");

const getHelp = () => {
  return {
    title: "🤖 Private Agent 사용법",
    commands: [
      "/start - 봇 시작",
      "/help - 도움말",
      "/ping - 연결 확인",
      "/status - 에이전트 상태 확인",
      "/ask 질문 - AI에게 질문",
      "/plan 주제 - 개발 계획 생성",
      "/review 코드 - 코드 리뷰",
    ],
  };
};

const sendMessage = async (message) => {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.error("Telegram bot token or chat ID is missing.");
      return;
    }

    console.log("Sending message to Telegram:", message);

    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      },
    );
    console.log("Sending message to Telegram response:", response);
    if (!response.ok) {
      throw new Error(`Telegram sendMessage failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

const sendReview = async (prInfo, review) => {
  const message = buildReviewMessage(prInfo, review);
  await sendMessage(message);
};

module.exports = {
  getHelp,
  sendMessage,
  sendReview,
};
