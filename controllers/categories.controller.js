const {
  fetchCategories,
  fetchReviewById,
  updateReviewVoteById,
  fetchUsers,
  fetchReviews,
  fetchCommentsByReviewId,
  addCommentsByReviewId,
} = require("../models/categories.model");

exports.getCategories = (req, res, next) => {
  fetchCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewById = (req, res, next) => {
  const reviewId = req.params.review_id;
  fetchReviewById(reviewId)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.changeReviewVote = (req, res, next) => {
  const reviewId = req.params.review_id;
  const incVotes = req.body.inc_votes;
  updateReviewVoteById(incVotes, reviewId)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(er);
    });
};

exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await fetchReviews();
    res.status(200).send({ reviews });
  } catch (error) {
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
