const githubApiService = require("./githubApiService");
const openaiService = require("./openaiService");

const handleWebhook = async (payload) => {
  console.log("Received GitHub webhook payload:", payload);

  const action = payload.action;
  const repository = payload.repository?.full_name;
  const pull_request = payload.pull_request;

  if (!pull_request) {
    console.log("[Github] Not pull request event");
    return {
      ok: true,
      ignore: true,
      message: "not_pull_request.",
    };
  }

  const prInfo = {
    action,
    repository,
    number: pull_request.number,
    title: pull_request.title,
    author: pull_request.user?.login,
    body: pull_request.body,
    url: pull_request.html_url,
    diff_url: pull_request.diff_url,
  };

  console.log("[Github] Pull Request Info:", prInfo);

  const diff = githubApiService.getPullRequestDiff(prInfo.diff_url);

  console.log("[Github] PR Diff Preview:");
  console.log(diff.slice(0, 2000));

  return {
    ok: true,
    event: "pull_request",
    pr: prInfo,
  };
};

module.exports = {
  handleWebhook,
};
