const db = require("../db/connection");

exports.fetchCategories = () => {
  return db
    .query("SELECT slug, description FROM categories")
    .then(({ rows }) => {
      // here i am destructuring rows from query result comming back from database
      return rows;
    });
};

exports.fetchReviewById = (id) => {
  return db
    .query("SELECT * FROM reviews WHERE review_id = $1", [id])
    .then(({ rows, rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: `no review id = ${id}`,
        });
      }
      return rows[0];
    });
};

exports.updateReviewVoteById = (incVotes, reviewId) => {
  if (incVotes === undefined || isNaN(Number(incVotes))) {
    return Promise.reject({
      status: 400,
      msg: `please input valid inc_votes value`,
    });
  }
  return db
    .query(
      "UPDATE reviews SET votes = votes + $1  WHERE review_id = $2 RETURNING *",
      [incVotes, reviewId]
    )
    .then(({ rows, rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: `no review id = ${reviewId}`,
        });
      }
      return rows[0];
    });
};

exports.fetchUsers = async () => {
  const queryStr = "SELECT username, name, avatar_url FROM users";
  const { rows } = await db.query(queryStr);
  return rows;
};
