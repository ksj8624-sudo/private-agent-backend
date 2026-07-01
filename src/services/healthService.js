const getHealth = () => {
  return { ok: true, service: "private-agent-backend", status: "running" };
};

module.exports = {
  getHealth,
};
