const db = require("../db/connection");
const { checkExist } = require("../db/seeds/utils");

exports.deleteCommentById = async (commentId) => {
  if (isNaN(Number(commentId))) {
    return Promise.reject({
      status: 400,
      msg: `invalid comment ID (${commentId})`,
    });
  }
  await checkExist("comments", "comment_id", commentId);
  const queryStr = "DELETE FROM comments WHERE comment_id = $1";
  await db.query(queryStr, [commentId]);
};
