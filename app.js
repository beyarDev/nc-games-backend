const express = require("express");
const app = express();
const {
  getCategories,
  getReviewById,
} = require("./controllers/categories.controller");

app.get("/api/categories", getCategories);


app.use("*", (req, res) => {
  res.status(404).send({ msg: "404 no such route" });
});
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "oops something went wrong please report it" });
});
module.exports = app;