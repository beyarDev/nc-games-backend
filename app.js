const express = require("express");
const app = express();
const apiRouter = require("./apiRouters/apiRouter");
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);

// error handlers
app.use("*", (req, res) => {
  res.status(404).send({ msg: "404 no such route" });
});

app.use((err, req, res, next) => {
  if (err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code) {
    console.log(err);
    res.status(400).send({ msg: "invalid input" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "oops something went wrong please report it" });
});

module.exports = app;
