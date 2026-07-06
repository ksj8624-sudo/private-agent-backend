const buildPlanPrompt = (topic) => {
  return `너는 개발 계획을 세워주는 시니어 개발 리더야.
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
};

module.exports = {
  buildPlanPrompt,
};
