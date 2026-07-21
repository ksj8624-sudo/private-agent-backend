const express = require("express");
const devController = require("../controllers/devController");
const router = express.Router();

router.post("/agent", devController.requestAgent);
module.exports = router;
