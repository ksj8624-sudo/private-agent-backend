const fs = require("fs");
const path = require("path");

const readPrompt = (name) => {
  const filePath = path.join(process.cwd(), ".cursor", "prompts", `${name}.md`);

  console.log(filePath);
  const prompt = fs.readFileSync(filePath, "utf8");
  console.log(`prompt : ${prompt}`);
  return prompt;
};

const buildFeaturePrompt = (task) => {
  return `${readPrompt("feature")}

    작업:
    ${task}`;
};

const buildRefactorPrompt = (task) => {
  return `${readPrompt("refactor")}

    작업:
    ${task}`;
};

const buildBugfixPrompt = (task) => {
  return `${readPrompt("bugfix")}

    작업:
    ${task}`;
};

const buildReviewPrompt = (task) => {
  return `${readPrompt("review")}

    작업:
    ${task}`;
};

module.exports = {
  buildFeaturePrompt,
  buildRefactorPrompt,
  buildBugfixPrompt,
  buildReviewPrompt,
};
