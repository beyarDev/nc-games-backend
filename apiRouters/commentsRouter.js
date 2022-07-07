const commentsRouter = require("express").Router();
const { removeCommentById } = require("../controllers/comments.controller");

commentsRouter.delete("/:comment_id", removeCommentById);

module.exports = commentsRouter;
