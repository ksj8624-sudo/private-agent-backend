const { spawn } = require("child_process");

const executeCli = ({
  command,
  args,
  cwd,
  timeoutMs = 300000,
  ignoreStdin = false,
}) => {
  return new Promise((resolve, reject) => {
    console.log("[cliExecutor] Start", {
      command,
      args,
      cwd,
      timeoutMs,
      ignoreStdin,
    });

    const child = spawn(command, args, {
      cwd,
      env: process.env,
      stdio: [ignoreStdin ? "ignore" : "pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let settled = false;

    const finish = (callback) => {
      if (settled) {
        return false;
      }

      settled = true;
      clearTimeout(timer);
      callback();
    };

    const timer = setTimeout(() => {
      finish(() => {
        child.kill("SIGTERM");

        reject(
          new Error(`CLI execution timed out after ${timeoutMs}ms: ${command}`),
        );
      });
    }, timeoutMs);

    child.stdout.on("data", (data) => {
      const output = data.toString();
      stdout += output;

      console.log("[cliExecutor] stdout", output.trim());
    });

    child.stderr.on("data", (data) => {
      const output = data.toString();
      stderr += output;

      console.error("[cliExecutor] stderr", output.trim());
    });

    child.on("error", (error) => {
      finish(() => {
        console.error("[cliExecutor] Spawn error", {
          message: error.message,
          code: error.code,
          path: error.path,
          spawnargs: error.spawnargs,
        });

        reject(error);
      });
    });

    child.on("close", (code, signal) => {
      finish(() => {
        console.log("[cliExecutor] Closed", {
          code,
          signal,
          stdoutLength: stdout.length,
          stderrLength: stderr.length,
        });

        if (code !== 0) {
          reject(
            new Error(
              stderr.trim() ||
                `${command} exited with code ${code}${
                  signal ? ` (signal: ${signal})` : ""
                }`,
            ),
          );
          return;
        }

        resolve({
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          exitCode: code,
        });
      });
    });
  });
};

module.exports = {
  executeCli,
};
