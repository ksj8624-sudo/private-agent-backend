const express = require("express");
const apiController = require("../controllers/apiController");
const router = express.Router();

router.get("/ping", apiController.getPing);
router.post("/ask", apiController.askQuestion);
router.post("/plan", apiController.generatePlan);
module.exports = router;
