const db = require("../db/sqlite");

const findByEmail = (email) => {
  const stmt = db.prepare(`SELECT * FROM users WHERE email = ?`);
  return stmt.get(email);
};

const findById = (id) => {
  const stmt = db.prepare(`SELECT * FROM users WHERE id = ?`);
  return stmt.get(id);
};

const upsertByEmail = ({ email, passwordHash }) => {
  const existing = findByEmail(email);

  if (existing) {
    db.prepare(
      `UPDATE users
       SET password_hash = @passwordHash, is_active = 1, updated_at = CURRENT_TIMESTAMP
       WHERE id = @id`,
    ).run({ passwordHash, id: existing.id });

    return findById(existing.id);
  }

  const result = db
    .prepare(
      `INSERT INTO users (email, password_hash) VALUES (@email, @passwordHash)`,
    )
    .run({ email, passwordHash });

  return findById(result.lastInsertRowid);
};

const updateLastLogin = (id) => {
  db.prepare(
    `UPDATE users
     SET last_login_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
  ).run(id);
};

const saveRefreshToken = ({ userId, tokenHash, expiresAt }) => {
  const result = db
    .prepare(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES (@userId, @tokenHash, @expiresAt)`,
    )
    .run({ userId, tokenHash, expiresAt });

  return { id: result.lastInsertRowid };
};

const findRefreshTokenByHash = (tokenHash) => {
  const stmt = db.prepare(`SELECT * FROM refresh_tokens WHERE token_hash = ?`);
  return stmt.get(tokenHash);
};

const revokeRefreshTokenById = (id) => {
  db.prepare(
    `UPDATE refresh_tokens SET revoked_at = CURRENT_TIMESTAMP WHERE id = ? AND revoked_at IS NULL`,
  ).run(id);
};

// Rotation: 기존 Refresh Token revoke와 새 Refresh Token 저장을 하나의 Transaction으로 처리한다.
// 중간에 실패하면(revoke만 되고 insert가 안 되는 등) 전체가 자동으로 rollback된다.
const rotateRefreshToken = db.transaction(({ oldTokenId, userId, tokenHash, expiresAt }) => {
  db.prepare(
    `UPDATE refresh_tokens SET revoked_at = CURRENT_TIMESTAMP WHERE id = ? AND revoked_at IS NULL`,
  ).run(oldTokenId);

  const result = db
    .prepare(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES (@userId, @tokenHash, @expiresAt)`,
    )
    .run({ userId, tokenHash, expiresAt });

  return { id: result.lastInsertRowid };
});

module.exports = {
  findByEmail,
  findById,
  upsertByEmail,
  updateLastLogin,
  saveRefreshToken,
  findRefreshTokenByHash,
  revokeRefreshTokenById,
  rotateRefreshToken,
};
