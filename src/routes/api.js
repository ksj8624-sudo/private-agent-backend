const express = require("express");
const apiController = require("../controllers/apiController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/ping", apiController.getPing);
router.post("/ask", authMiddleware, apiController.askQuestion);
router.post("/plan", authMiddleware, apiController.generatePlan);
router.post("/review", authMiddleware, apiController.reviewCode);
module.exports = router;
