const { spawn } = require("child_process");
const path = require("path");

const WORKSPACE_PATH = path.resolve(process.cwd());

const execute = ({ prompt, mode = "ask" }) => {
  return new Promise((resolve, reject) => {
    const child = spawn(
      "cursor",
      [
        "agent",
        "--print",
        "--trust",
        "--mode",
        mode,
        "--workspace",
        WORKSPACE_PATH,
        prompt,
      ],
      {
        cwd: WORKSPACE_PATH,
        env: process.env,
      },
    );

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("error", (error) => {
      reject(error);
    });

    child.on("close", (code) => {
      if (code !== 0) {
        return reject(
          new Error(`Cursor Agent failed with code ${code}: ${stderr}`),
        );
      }

      resolve(stdout.trim());
    });
  });
};

module.exports = {
  execute,
};
