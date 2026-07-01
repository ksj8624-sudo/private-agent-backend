const healthService = require("../services/healthService");

const getHealth = (req, res) => {
  const result = healthService.getHealth();
  res.json(result);
};

module.exports = {
  getHealth,
};
