const { executeCli } = require("./cliExecutor");
const { getWorkspacePath } = require("../../config/workspaces");

const execute = async ({ prompt, workspace }) => {
  const workspacePath = getWorkspacePath(workspace);

  const result = await executeCli({
    command: "codex",
    args: ["exec", prompt],
    cwd: workspacePath,
    ignoreStdin: true,
  });

  return result.stdout;
};

module.exports = {
  execute,
};
