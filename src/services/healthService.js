const getPing = (req, res) => {
  return { message: "pong" };
};

const getHealth = () => {
  return { ok: true, service: "private-agent-backend", status: "running" };
};

module.exports = {
  getHealth,
  getPing,
};
