const { spawn } = require("child_process");
const path = require("path");
const { getWorkspacePath } = require("../config/workspaces");

const execute = ({ workspace, prompt, mode }) => {
  const workspacePath = getWorkspacePath(workspace);
  console.log("[Cursor] Start");
  console.log("[Cursor] Workspace:", workspace);
  console.log("[Cursor] Workspace path:", workspacePath);
  console.log("[Cursor] Mode:", mode ?? "agent");
  console.log("[cursorAgentService] PATH", process.env.PATH);
  return new Promise((resolve, reject) => {
    const args = ["agent", "--print", "--trust"];
    if (mode) {
      args.push("--mode", mode);
    }
    args.push("--workspace", workspacePath, prompt);
    const child = spawn("cursor", args, {
      cwd: workspacePath,
      env: process.env,
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("error", (error) => {
      console.error("[Cursor] Spawn failed:", error);
      reject(error);
    });

    child.on("close", (code) => {
      console.log("[Cursor] Closed");
      console.log("[Cursor] Exit code:", code);
      console.log("[Cursor] stdout length:", stdout.length);
      if (code !== 0) {
        return reject(
          new Error(`Cursor Agent failed with code ${code}: ${stderr}`),
        );
      }

      console.log("[Cursor] Completed");
      resolve(stdout.trim());
    });
  });
};

module.exports = {
  execute,
};
