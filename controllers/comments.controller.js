const {
  deleteCommentById,
  updateCommentVoteById,
} = require("../models/comments.models");

exports.removeCommentById = async (req, res, next) => {
  const { comment_id } = req.params;
  try {
    await deleteCommentById(comment_id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

exports.patchCommentVoteById = async (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  try {
    const comment = await updateCommentVoteById(inc_votes, comment_id);
    res.status(200).send({ comment });
  } catch (err) {
    next(err);
  }
};
