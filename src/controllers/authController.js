const authService = require("../services/authService");

const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VALIDATION_ERROR = {
  error: "validation_failed",
  message: "입력값이 올바르지 않습니다.",
};

const isBlank = (value) => typeof value !== "string" || value.trim().length === 0;

const respondAuthError = (res, error) => {
  if (error instanceof authService.AuthError) {
    return res.status(error.status).json({ error: error.code, message: error.message });
  }
  throw error;
};

const login = async (req, res) => {
  const { email, password } = req.body || {};

  if (isBlank(email) || isBlank(password) || !EMAIL_FORMAT.test(email.trim())) {
    return res.status(400).json(VALIDATION_ERROR);
  }

  try {
    const result = await authService.login({ email: email.trim(), password });
    return res.json(result);
  } catch (error) {
    return respondAuthError(res, error);
  }
};

const refresh = (req, res) => {
  const { refreshToken } = req.body || {};

  if (isBlank(refreshToken)) {
    return res.status(400).json(VALIDATION_ERROR);
  }

  try {
    const result = authService.refresh({ refreshToken: refreshToken.trim() });
    return res.json(result);
  } catch (error) {
    return respondAuthError(res, error);
  }
};

const logout = (req, res) => {
  const { refreshToken } = req.body || {};

  if (isBlank(refreshToken)) {
    return res.status(400).json(VALIDATION_ERROR);
  }

  try {
    const result = authService.logout({ refreshToken: refreshToken.trim() });
    return res.json(result);
  } catch (error) {
    return respondAuthError(res, error);
  }
};

const me = (req, res) => {
  try {
    const result = authService.getMe(req.user.id);
    return res.json(result);
  } catch (error) {
    return respondAuthError(res, error);
  }
};

module.exports = {
  login,
  refresh,
  logout,
  me,
};
