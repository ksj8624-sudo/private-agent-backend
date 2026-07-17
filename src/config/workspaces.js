const path = require("path");

const WORKSPACE_PATHS = {
  backend: path.resolve(
    process.env.PRIVATE_AGENT_BACKEND_PATH || process.cwd(),
  ),
  server: path.resolve(
    process.env.PRIVATE_AGENT_SERVER_PATH || "../private-agent-server",
  ),
  front: path.resolve(
    process.env.PRIVATE_AGENT_FRONT_PATH || "../ai-agent-lab",
  ),
};

const getWorkspacePath = (workspace) => {
  const workspacePath = WORKSPACE_PATHS[workspace];

  if (!workspacePath) {
    throw new Error(`Unsupported workspace: ${workspace}`);
  }

  return workspacePath;
};

module.exports = {
  getWorkspacePath,
};
