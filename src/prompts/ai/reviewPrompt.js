const buildReviewPrompt = (diff) => {
  const prompt = `
    너는 시니어 개발자야.
    아래 Pull Request diff를 코드 리뷰해줘.

    리뷰 기준:
    1. 버그 가능성
    2. 구조/설계 개선점
    3. 네이밍/오타
    4. 에러 처리
    5. 보안상 주의점
    6. 전체 평가

    너무 길지 않게 한국어로 정리해줘.

    PR Diff:
    ${diff}
    `;
  return prompt;
};

module.exports = {
  buildReviewPrompt,
};
