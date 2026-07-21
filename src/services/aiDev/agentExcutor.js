const executors = {
  cursor: executeCursor,
  claude: executeClaude,
  codex: executeCodex,
  gemini: executeGemini,
};
const executeAgent = async ({ agent, workspacePath, prompt, mode }) => {
  const executor = executors[agent];

  if (!executor) {
    throw new Error(`Unsupported agent: ${agent}`);
  }

  return executor({
    workspacePath,
    prompt,
    mode,
  });
};
