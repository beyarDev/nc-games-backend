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

exports.updateCommentVoteById = async (incVotes, commentId) => {
  if (isNaN(Number(commentId))) {
    return Promise.reject({
      status: 400,
      msg: `invalid comment ID (${commentId})`,
    });
  }
  if (incVotes === undefined || isNaN(Number(incVotes))) {
    return Promise.reject({
      status: 400,
      msg: `please input valid inc_votes value`,
    });
  }
  await checkExist("comments", "comment_id", commentId);
  const { rows } = await db.query(
    "UPDATE comments SET votes = votes + $1  WHERE comment_id = $2 RETURNING *",
    [incVotes, commentId]
  );
  return rows[0];
};
