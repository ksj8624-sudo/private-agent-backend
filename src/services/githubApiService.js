const fetchDiff = async (diffUrl) => {
  const response = await fetch(diffUrl, {
    headers: {
      Accept: "application/vnd.github.v3.diff",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch diff from ${response.status}`);
  }

  return response.text();
};

module.exports = {
  fetchDiff,
};
