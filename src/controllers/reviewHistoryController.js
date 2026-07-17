const reviewHistoryService = require("../services/reviewHistoryService");
const getReviewHistory = async (req, res) => {
  const reviewHistory = await reviewHistoryService.getReviewHistory();
  res.json(reviewHistory);
};

module.exports = {
  getReviewHistory,
};
