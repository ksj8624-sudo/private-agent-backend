const aiDevService = require("../services/aiDevService");
const { VALID_AI_DEV_TYPES } = require("../constants/aiDevConstant");

const requestCursor = async (req, res) => {
  const payload = req.body;
  if (!payload) {
    return res.status(400).json({ error: "Payload is required." });
  }

  if (!VALID_AI_DEV_TYPES.includes(payload.type)) {
    return res.status(400).json({ error: "Invalid dev request type." });
  }

  if (!payload.task) {
    return res.status(400).json({ error: "Task is required." });
  }

  let answer = await aiDevService.requestCursor(payload);
  return res.json({
    ok: true,
    tool: "cursor",
    type: payload.type,
    answer,
  });
};

module.exports = {
  requestCursor,
};
