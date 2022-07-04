const express = require("express");
const app = express();
const {
  getCategories,
  getReviewById,
  changeReviewVote,
} = require("./controllers/categories.controller");

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewById);
app.patch("/api/reviews/:review_id", changeReviewVote);
app.use("*", (req, res) => {
  res.status(404).send({ msg: "404 no such route" });
});

app.use((err, req, res, next) => {
  if (err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "please provide inc_votes" });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: "invalid input" });
  } else if (err.code) {
    console.log(err);
    res.status(400).send({ msg: "invalid" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "oops something went wrong please report it" });
});
module.exports = app;
