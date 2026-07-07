const reviewHistoryRepository = require("../repositories/reviewHistoryRepository");

const saveReview = async ({
  repository,
  prNumber,
  title,
  author,
  prUrl,
  review,
}) => {
  return reviewHistoryRepository.save({
    repository,
    prNumber,
    title,
    author,
    prUrl,
    review,
  });
};

const getReviewHistory = async (limit) => {
  return reviewHistoryRepository.findRecent(limit);
};

module.exports = {
  saveReview,
  getReviewHistory,
};
