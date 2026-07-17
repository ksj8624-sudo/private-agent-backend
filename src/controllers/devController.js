const aiDevService = require("../services/aiDevService");
const { VALID_AI_DEV_TYPES } = require("../constants/aiDevConstant");
const { VALID_AI_DEV_WORKSPACES } = require("../constants/aiDevConstant");

const requestCursor = async (req, res) => {
  const payload = req.body;
  if (!payload) {
    return res.status(400).json({ error: "Payload is required." });
  }

  console.log(`workspace ${payload.workspace}`);
  if (!VALID_AI_DEV_WORKSPACES.includes(payload.workspace)) {
    return res.status(400).json({ error: "Invalid dev request workspace." });
  }

  if (!VALID_AI_DEV_TYPES.includes(payload.type)) {
    return res.status(400).json({ error: "Invalid dev request type." });
  }

  if (!payload.task) {
    return res.status(400).json({ error: "Task is required." });
  }

  let answer = await aiDevService.requestCursor({
    workspace: payload.workspace,
    type: payload.type,
    task: payload.task.trim(),
  });
  return res.json({
    ok: true,
    tool: "cursor",
    workspace: payload.workspace,
    type: payload.type,
    answer,
  });
};

module.exports = {
  requestCursor,
};
