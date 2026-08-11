const express = require("express");
const reviewHistoryController = require("../controllers/reviewHistoryController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", authMiddleware, reviewHistoryController.getReviewHistory);

module.exports = router;
