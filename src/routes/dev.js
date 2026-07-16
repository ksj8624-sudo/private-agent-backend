const express = require("express");
const devController = require("../controllers/devController");
const router = express.Router();

router.post("/cursor", devController.requestCursor);
module.exports = router;
