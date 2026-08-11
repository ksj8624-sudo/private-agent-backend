const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const env = require("../config/env");
const userRepository = require("../repositories/userRepository");

class AuthError extends Error {
  constructor(code, status, message) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

const EXPIRES_IN_UNIT_MS = { s: 1000, m: 60 * 1000, h: 60 * 60 * 1000, d: 24 * 60 * 60 * 1000 };

const parseExpiresInMs = (value) => {
  const match = /^(\d+)([smhd])$/.exec(String(value).trim());
  if (!match) {
    return Number(value) * 1000;
  }
  const [, amount, unit] = match;
  return Number(amount) * EXPIRES_IN_UNIT_MS[unit];
};

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const toPublicUser = (user) => ({ id: user.id, email: user.email });

// 순수하게 토큰 값만 계산한다(DB 쓰기 없음). 호출부가 필요한 방식(단순 저장 vs
// 원자적 rotation)으로 영속화를 처리한다.
const buildTokenPair = (user) => {
  const accessToken = jwt.sign(
    { sub: user.id, email: user.email },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES_IN },
  );
  const refreshToken = jwt.sign(
    { sub: user.id },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN },
  );

  const accessExpiresAt = new Date(Date.now() + parseExpiresInMs(env.JWT_ACCESS_EXPIRES_IN));
  const refreshExpiresAt = new Date(Date.now() + parseExpiresInMs(env.JWT_REFRESH_EXPIRES_IN));

  return {
    accessToken,
    refreshToken,
    accessExpiresAt,
    refreshExpiresAt,
    tokenHash: hashToken(refreshToken),
    user: toPublicUser(user),
  };
};

const toAuthResponse = (pair) => ({
  accessToken: pair.accessToken,
  refreshToken: pair.refreshToken,
  expiresAt: pair.accessExpiresAt.toISOString(),
  user: pair.user,
});

const login = async ({ email, password }) => {
  const user = userRepository.findByEmail(email);

  if (!user) {
    throw new AuthError("invalid_credentials", 401, "이메일 또는 비밀번호가 올바르지 않습니다.");
  }

  // [확인 필요] 설계 문서(login-auth.md)와 API Contract(backend-api-spec.xlsx)에
  // 비활성 사용자 전용 error code가 정의되어 있지 않아, 계정 상태를 노출하지 않는
  // 보안 원칙(4.3/13절 "인증 실패 시 민감 정보 노출 금지")에 따라 invalid_credentials로 통일함.
  if (!user.is_active) {
    throw new AuthError("invalid_credentials", 401, "이메일 또는 비밀번호가 올바르지 않습니다.");
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatches) {
    throw new AuthError("invalid_credentials", 401, "이메일 또는 비밀번호가 올바르지 않습니다.");
  }

  const pair = buildTokenPair(user);
  userRepository.saveRefreshToken({
    userId: user.id,
    tokenHash: pair.tokenHash,
    expiresAt: pair.refreshExpiresAt.toISOString(),
  });
  userRepository.updateLastLogin(user.id);

  return toAuthResponse(pair);
};

const refresh = ({ refreshToken }) => {
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new AuthError("invalid_refresh_token", 401, "세션이 만료되었거나 유효하지 않습니다.");
  }

  const tokenHash = hashToken(refreshToken);
  const stored = userRepository.findRefreshTokenByHash(tokenHash);

  if (!stored || stored.user_id !== decoded.sub) {
    throw new AuthError("invalid_refresh_token", 401, "세션이 만료되었거나 유효하지 않습니다.");
  }

  if (stored.revoked_at) {
    throw new AuthError("invalid_refresh_token", 401, "세션이 만료되었거나 유효하지 않습니다.");
  }

  if (new Date(stored.expires_at).getTime() <= Date.now()) {
    throw new AuthError("invalid_refresh_token", 401, "세션이 만료되었거나 유효하지 않습니다.");
  }

  const user = userRepository.findById(stored.user_id);
  if (!user || !user.is_active) {
    throw new AuthError("invalid_refresh_token", 401, "세션이 만료되었거나 유효하지 않습니다.");
  }

  // Rotation: 기존 Refresh Token revoke와 새 Refresh Token 저장을 하나의 Transaction으로 처리한다.
  // (Bugfix Major #1 - 중간 실패 시 rollback되어 "폐기됐지만 새 토큰은 없는" 상태를 방지)
  const pair = buildTokenPair(user);
  userRepository.rotateRefreshToken({
    oldTokenId: stored.id,
    userId: user.id,
    tokenHash: pair.tokenHash,
    expiresAt: pair.refreshExpiresAt.toISOString(),
  });

  return toAuthResponse(pair);
};

const logout = ({ refreshToken }) => {
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new AuthError("unauthorized", 401, "인증이 필요합니다.");
  }

  const tokenHash = hashToken(refreshToken);
  const stored = userRepository.findRefreshTokenByHash(tokenHash);

  if (!stored || stored.user_id !== decoded.sub || stored.revoked_at) {
    throw new AuthError("unauthorized", 401, "인증이 필요합니다.");
  }

  userRepository.revokeRefreshTokenById(stored.id);

  return { message: "logged_out" };
};

// (Bugfix Major #2) JWT 서명/만료 검증 이후 실제 DB에서 사용자를 재조회하고
// is_active를 확인한다(설계 8절 "4. 사용자 정보 조회" 단계). 이를 통해 이미
// 발급된 Access Token이라도 사용자가 삭제/비활성화되면 즉시 인증 실패로 처리되며,
// req.user는 JWT payload가 아닌 실제 DB User 기준으로 구성된다.
const verifyAccessToken = (accessToken) => {
  let decoded;
  try {
    decoded = jwt.verify(accessToken, env.JWT_ACCESS_SECRET);
  } catch (error) {
    throw new AuthError("unauthorized", 401, "인증이 필요합니다.");
  }

  const user = userRepository.findById(decoded.sub);
  if (!user || !user.is_active) {
    throw new AuthError("unauthorized", 401, "인증이 필요합니다.");
  }

  return toPublicUser(user);
};

const getMe = (userId) => {
  const user = userRepository.findById(userId);
  if (!user || !user.is_active) {
    throw new AuthError("unauthorized", 401, "인증이 필요합니다.");
  }
  return { user: toPublicUser(user) };
};

module.exports = {
  AuthError,
  hashToken,
  login,
  refresh,
  logout,
  verifyAccessToken,
  getMe,
};
