const { executeCli } = require("./cliExecutor");
const { getWorkspacePath } = require("../../config/workspaces");

const execute = async ({ prompt, mode = "ask", workspace }) => {
  const workspacePath = getWorkspacePath(workspace);
  console.log(`cursor workspace ${workspacePath}`);
  const args = [
    "agent",
    "--print",
    "--trust",
    "--mode",
    mode,
    "--workspace",
    workspacePath,
    prompt,
  ];

  console.log("[cursorAgentService] Execute", {
    command: "cursor",
    args,
    workspacePath,
  });

  const result = await executeCli({
    command: "cursor",
    args,
    cwd: workspacePath,
  });

  return result.stdout;
};

module.exports = {
  execute,
};
