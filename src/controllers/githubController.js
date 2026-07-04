const githubSurvice = require("../services/githubService");

const handleWebhook = async (req, res) => {
  const payload = req.body;

  if (!payload) {
    return res.status(400).json({ error: "Payload is required." });
  }

  const result = await githubSurvice.handleWebhook(payload);
  res.json(result);
};

module.exports = {
  handleWebhook,
};
