const db = require("../db/sqlite");

const save = ({
  agentType,
  workspace,
  taskType,
  task,
  result,
  status,
  durationMs,
  errorMessage,
}) => {
  const stmt = db.prepare(`
        INSERT INTO agent_histories (
            agent_type,
            workspace,
            task_type,
            task,
            result,
            status,
            duration_ms,
            error_message
        ) VALUES (@agentType, @workspace, @taskType, @task, @result, @status, @durationMs, @errorMessage) 
    `);

  const insertResult = stmt.run({
    agentType,
    workspace,
    taskType,
    task,
    result,
    status,
    durationMs,
    errorMessage,
  });

  return { id: insertResult.lastInsertRowid };
};

const findRecent = (limit = 20) => {
  const stmt = db.prepare(`
        SELECT 
        id,
        agent_type AS agentType,
        workspace,
        task_type AS taskType,
        task,
        result,
        status,
        duration_ms AS durationMs,
        error_message AS errorMessage,
        created_at AS createAt
        FROM agent_histories
        ORDER BY id DESC
        LIMIT ?
        `);

  const rows = stmt.all(limit);
  return rows;
};

module.exports = {
  save,
  findRecent,
};
