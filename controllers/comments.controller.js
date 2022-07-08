const { deleteCommentById } = require("../models/comments.models");
exports.removeCommentById = async (req, res, next) => {
  const { comment_id } = req.params;
  try {
    await deleteCommentById(comment_id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
