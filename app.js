const express = require("express");
const app = express();
const {
  getCategories,
  getReviewById,
  changeReviewVote,
  getUsers,
  getReviews,
  getCommentsByReviewId,
  postCommentsByReviewId,
  removeCommentById,
  getEndpoints,
} = require("./controllers/categories.controller");

app.use(express.json());

// routes

app.get("/api", getEndpoints);
app.get("/api/users", getUsers);
app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewById);
app.patch("/api/reviews/:review_id", changeReviewVote);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
app.post("/api/reviews/:review_id/comments", postCommentsByReviewId);
app.delete("/api/comments/:comment_id", removeCommentById);

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
