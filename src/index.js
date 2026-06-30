const express = require("express");
const healthRouter = require("./routes/health");
const apiRouter = require("./routes/api");
const telegramRouter = require("./routes/telegram");
const app = express();

const PORT = 3000;

app.use("/health", healthRouter);
app.use("/api", apiRouter);
app.use("/telegram", telegramRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the Private Agent Backend!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
