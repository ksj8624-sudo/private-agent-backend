const express = require("express");
const devController = require("../controllers/devController");
const router = express.Router();

router.use((req, res, next) => {
  console.log("[APP REQUEST]", req.method, req.originalUrl);
  next();
});

router.use(express.json());

router.get("/agent/history", devController.getAgentHistories);
router.post("/agent", devController.requestAgent);

module.exports = router;
