const buildReviewMessage = (prInfo, review) => {
  const reviewText = review.answer || review;

  return `
    🤖 AI Pull Request Review

    📦 Repository
    ${prInfo.repository}

    📝 PR
    #${prInfo.number} ${prInfo.title}

    👤 Author
    ${prInfo.author}

    🔗 URL
    ${prInfo.url}

    ━━━━━━━━━━━━━━━━━━

    ${reviewText}
    `;
};

module.exports = {
  buildReviewMessage,
};
