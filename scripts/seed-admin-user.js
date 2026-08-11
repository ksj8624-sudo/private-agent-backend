require("dotenv").config();

const bcrypt = require("bcryptjs");
const env = require("../src/config/env");
const userRepository = require("../src/repositories/userRepository");

// 동일 email이 이미 존재하면 비밀번호 해시를 갱신한다(재실행 시 비밀번호 교체 용도).
// 존재하지 않으면 새로 생성한다. 회원가입 기능이 없으므로 초기 관리자 계정은
// 이 스크립트로만 생성/갱신한다(login-auth.md 6.4/9절).
const run = async () => {
  const email = env.INITIAL_ADMIN_EMAIL;
  const password = env.INITIAL_ADMIN_PASSWORD;

  if (!email || !password) {
    console.error(
      "INITIAL_ADMIN_EMAIL, INITIAL_ADMIN_PASSWORD 환경 변수가 필요합니다.",
    );
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = userRepository.upsertByEmail({ email, passwordHash });

  console.log(`관리자 계정이 준비되었습니다: id=${user.id}, email=${user.email}`);
};

run().catch((error) => {
  console.error("관리자 계정 생성 중 오류가 발생했습니다:", error.message);
  process.exit(1);
});
