const reviewsRouter = require("express").Router();
const {
  getReviews,
  getReviewById,
  changeReviewVote,
  getCommentsByReviewId,
  postCommentsByReviewId,
  postComment
} = require("../controllers/reviews.controller");

reviewsRouter.route("/").get(getReviews).post(postComment);
reviewsRouter.route("/:review_id").get(getReviewById).patch(changeReviewVote);
reviewsRouter
  .route("/:review_id/comments")
  .get(getCommentsByReviewId)
  .post(postCommentsByReviewId);
module.exports = reviewsRouter;
