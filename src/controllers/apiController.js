const apiService = require("../services/apiService");

const getPing = (req, res) => {
  const result = apiService.getPing();
  res.json(result);
};

module.exports = {
  getPing,
};
