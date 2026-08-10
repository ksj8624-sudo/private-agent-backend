const { executeCli } = require("./cliExecutor");
const {
  geetWorkspacePath,
  getWorkspacePath,
} = require("../../config/workspaces");

const execute = async ({ prompt, workspace }) => {
  console.log(`workspace ${workspace}`);
  const workspacePath = getWorkspacePath(workspace);
  console.log(`claude workspace ${workspacePath}`);
  const args = ["--print", prompt];

  console.log("[cursorAgentService] Execute", {
    command: "claude",
    args,
    workspacePath,
  });

  const result = await executeCli({
    command: "claude",
    args,
    cwd: workspacePath,
  });

  return result.stdout;
};

module.exports = {
  execute,
};
