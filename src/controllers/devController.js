const aiDevService = require("../services/aiDevService");
const { VALID_AI_DEV_AGENT_TYPES } = require("../constants/aiDevConstant");
const { VALID_AI_DEV_TASK_TYPES } = require("../constants/aiDevConstant");
const { VALID_AI_DEV_WORKSPACES } = require("../constants/aiDevConstant");

const requestAgent = async (req, res) => {
  const payload = req.body;
  if (!payload) {
    return res.status(400).json({ error: "Payload is required." });
  }

  if (!VALID_AI_DEV_AGENT_TYPES.includes(payload.agentType)) {
    return res.status(400).json({ error: "Invalid dev request agent." });
  }

  if (!VALID_AI_DEV_WORKSPACES.includes(payload.workspace)) {
    return res.status(400).json({ error: "Invalid dev request workspace." });
  }

  if (!VALID_AI_DEV_TASK_TYPES.includes(payload.taskType)) {
    return res.status(400).json({ error: "Invalid dev request taskType." });
  }

  if (!payload.task) {
    return res.status(400).json({ error: "Task is required." });
  }

  let answer = await aiDevService.requestAgent({
    agent: payload.agentType,
    workspace: payload.workspace,
    taskType: payload.taskType,
    task: payload.task.trim(),
  });
  return res.json({
    ok: true,
    tool: payload.agentType,
    workspace: payload.workspace,
    type: payload.taskType,
    answer,
  });
};

module.exports = {
  requestAgent,
};
