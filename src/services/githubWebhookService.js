const githubApiService = require("./githubApiService");
const reviewService = require("./reviewService");
const telegramService = require("./telegramService");

const handleWebhook = async (payload) => {
  const action = payload.action;
  const repository = payload.repository?.full_name;
  const pull_request = payload.pull_request;

  if (!pull_request) {
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

  const diff = await githubApiService.fetchDiff(prInfo.diff_url);
  const reviewCode = await reviewService.reviewCode(diff);
  console.log("[Github] Create PR Comment start");
  await githubApiService.createPullRequestComment({
    repository: prInfo.repository,
    prNumber: prInfo.number,
    body: reviewCode,
  });
  console.log("[Github] Create PR Comment start");
  await telegramService.sendReview(prInfo, reviewCode);

  return {
    ok: true,
    event: "pull_request",
    pr: prInfo,
  };
};

module.exports = {
  handleWebhook,
};
