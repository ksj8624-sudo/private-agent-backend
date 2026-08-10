const env = require("./config/env");

const express = require("express");
const healthRouter = require("./routes/health");
const apiRouter = require("./routes/api");
const telegramRouter = require("./routes/telegram");
const githubRouter = require("./routes/github");
const reviewHistoryRouter = require("./routes/reviewHistory");
const devRouter = require("./routes/dev");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/health", healthRouter);
app.use("/api", apiRouter);
app.use("/telegram", telegramRouter);
app.use("/github", githubRouter);
app.use("/reviewHistory", reviewHistoryRouter);
app.use("/dev", devRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the Private Agent Backend!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
