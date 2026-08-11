const authService = require("../services/authService");

// 이 프로젝트에는 전역 오류 처리 미들웨어가 없으므로(공통 규칙 시트 참고),
// 인증 실패 응답은 여기서 직접 만들어 반환한다(next(error)로 위임하지 않음).
const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "unauthorized", message: "인증이 필요합니다." });
  }

  const accessToken = header.slice("Bearer ".length).trim();

  if (!accessToken) {
    return res.status(401).json({ error: "unauthorized", message: "인증이 필요합니다." });
  }

  try {
    req.user = authService.verifyAccessToken(accessToken);
    return next();
  } catch (error) {
    return res.status(401).json({ error: "unauthorized", message: "인증이 필요합니다." });
  }
};

module.exports = authMiddleware;
