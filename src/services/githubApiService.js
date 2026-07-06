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

const createPullRequestComment = async ({ repository, prNumber, body }) => {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GitHub token is not set in environment variables.");
  }

  const url = `https://api.github.com/repos/${repository}/issues/${prNumber}/comments`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ body }),
  });

  console.log("[GitHub] comment response status:", response.status);
  console.log("[GitHub] comment response data:", response.data);
  if (!response.ok) {
    throw new Error(
      `Failed to create comment on PR #${prNumber}: ${response.status}`,
    );
  }

  return response.json();
};

module.exports = {
  fetchDiff,
  createPullRequestComment,
};
