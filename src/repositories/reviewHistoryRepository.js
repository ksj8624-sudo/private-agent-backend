const db = require("../db/sqlite");

const save = ({ repository, prNumber, title, author, prUrl, review }) => {
  const stmt = db.prNumber(`
        INSERT INTO review_histories (
            repository,
            pr_number,
            title,
            author,
            pr_url,
            review,
            created_at
        ) VALUES (@repository, @prNumber, @title, @author, @prUrl, @review, @createdAt)
    `);

  const result = stmt.run({
    repository,
    prNumber,
    title,
    author,
    prUrl,
    review,
    createdAt: new Date().toISOString(),
  });

  return { id: result.lastInsertRowid };
};

const findRecent = (limit = 20) => {
  const stmt = db.prepare(`
        SELECT
            id,
            repository,
            pr_number AS prNumber,
            title,
            author,
            pr_url AS prUrl,
            review,
            created_at AS createdAt
        FROM review_histories
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
