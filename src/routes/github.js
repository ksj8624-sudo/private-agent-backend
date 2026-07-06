const express = require("express");
const githubController = require("../controllers/githubController");

const router = express.Router();

router.post("/webhook", githubController.handleWebhook);

module.exports = router;
