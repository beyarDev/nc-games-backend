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
  if (isNaN(Number(id))) {
    return Promise.reject({
      status: 400,
      msg: `invalid input ID (${id})`,
    });
  }
  return db
    .query(
      `SELECT reviews.*, COUNT(comments.review_id) AS comment_count FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id;`,
      [id]
    )
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

exports.fetchReviews = async () => {
  const queryStr = `SELECT reviews.*, COUNT(comments.review_id) AS comment_count FROM reviews
  LEFT JOIN comments ON reviews.review_id = comments.review_id
  GROUP BY reviews.review_id ORDER BY reviews.created_at DESC;`;
  const { rows } = await db.query(queryStr);
  return rows;
};

exports.fetchCommentsByReviewId = async (reviewId) => {
  if (isNaN(Number(reviewId))) {
    return Promise.reject({
      status: 400,
      msg: `invalid review ID (${reviewId})`,
    });
  }
  const { rows } = await db.query(
    "SELECT review_id FROM reviews WHERE review_id = $1",
    [reviewId]
  );
  if (rows.length) {
    const queryStr = `SELECT * FROM comments WHERE comments.review_id = $1`;
    const { rows } = await db.query(queryStr, [reviewId]);
    return rows;
  } else {
    return Promise.reject({
      status: 404,
      msg: `there is no ${reviewId} review id`,
    });
  }
};
