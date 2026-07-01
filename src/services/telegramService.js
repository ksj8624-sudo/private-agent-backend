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

module.exports = {
  getHelp,
};
