const {
  fetchReviews,
  fetchReviewById,
  updateReviewVoteById,
  fetchCommentsByReviewId,
  addCommentsByReviewId,
} = require("../models/reviews.model");

exports.getReviews = async (req, res, next) => {
  const { sort_by, order, category } = req.query;
  try {
    const reviews = await fetchReviews(sort_by, order, category);
    res.status(200).send({ reviews });
  } catch (err) {
    next(err);
  }
};

exports.getReviewById = async (req, res, next) => {
  const reviewId = req.params.review_id;
  try {
    const review = await fetchReviewById(reviewId);
    res.status(200).send({ review });
  } catch (err) {
    next(err);
  }
};

exports.changeReviewVote = async (req, res, next) => {
  const reviewId = req.params.review_id;
  const incVotes = req.body.inc_votes;
  try {
    const review = await updateReviewVoteById(incVotes, reviewId);
    res.status(200).send({ review });
  } catch (err) {
    next(err);
  }
};

exports.getCommentsByReviewId = async (req, res, next) => {
  const { review_id } = req.params;
  try {
    const comments = await fetchCommentsByReviewId(review_id);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

exports.postCommentsByReviewId = async (req, res, next) => {
  const { review_id } = req.params;
  const { username, body } = req.body;
  try {
    const comment = await addCommentsByReviewId(username, body, review_id);
    res.status(201).send({ comment });
  } catch (err) {
    next(err);
  }
};
