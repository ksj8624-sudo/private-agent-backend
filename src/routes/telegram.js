const express = require("express");
const getHelp = require("../controllers/telegramController");

const router = express.Router();

router.get("/help", getHelp.getHelp);

module.exports = router;
