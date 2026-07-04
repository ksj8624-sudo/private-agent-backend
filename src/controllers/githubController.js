const githubWebhookSurvice = require("../services/githubWebhookService");

const handleWebhook = async (req, res) => {
  const payload = req.body;

  if (!payload) {
    return res.status(400).json({ error: "Payload is required." });
  }

  const result = await githubWebhookSurvice.handleWebhook(payload);
  res.json(result);
};

module.exports = {
  handleWebhook,
};
