const express = require("express");
const apiController = require("../controllers/apiController");
const router = express.Router();

router.get("/ping", apiController.getPing);

module.exports = router;
