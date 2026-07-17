const express = require("express");
const reviewHistoryController = require("../controllers/reviewHistoryController");
const router = express.Router();

router.get("/", reviewHistoryController.getReviewHistory);

module.exports = router;
