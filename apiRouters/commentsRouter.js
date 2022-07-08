const commentsRouter = require("express").Router();
const {
  removeCommentById,
  patchCommentVoteById,
} = require("../controllers/comments.controller");

commentsRouter
  .route("/:comment_id")
  .delete(removeCommentById)
  .patch(patchCommentVoteById);

module.exports = commentsRouter;
