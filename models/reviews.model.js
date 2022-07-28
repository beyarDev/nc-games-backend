const db = require("../db/connection");
const { checkExist } = require("../db/seeds/utils");
exports.fetchReviews = async (sort_by, order, category, limit = 10) => {
  const values = [];
  const validOrders = ["ASC", "DESC"];
  const validSorts = [
    "review_id",
    "title",
    "category",
    "designer",
    "owner",
    "review_body",
    "review_img_url",
    "created_at",
    "votes",
    "comment_count",
  ];
  let queryStr = `SELECT reviews.*, CAST(COUNT(comments.review_id) AS INT) AS comment_count FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id`;
  if (category) {
    await checkExist("categories", "slug", category);
    queryStr += " WHERE reviews.category = $1";
    values.push(category);
  }
  queryStr += " GROUP BY reviews.review_id";
  if (validSorts.includes(sort_by)) {
    queryStr += ` ORDER BY reviews.${sort_by}`;
  } else {
    queryStr += ` ORDER BY reviews.created_at`;
  }
  if (validOrders.includes(order)) {
    queryStr += " " + order;
  } else {
    queryStr += " DESC";
  }
  if (!isNaN(Number(limit))) {
    queryStr += ` LIMIT ${limit}`;
  }
  if (values.length) {
    const { rows } = await db.query(queryStr, [category]);
    return rows;
  }
  const { rows } = await db.query(queryStr);
  return rows;
};

exports.updateReviewVoteById = async (incVotes, reviewId) => {
  if (isNaN(Number(reviewId))) {
    return Promise.reject({
      status: 400,
      msg: `invalid input ID (${reviewId})`,
    });
  }
  if (incVotes === undefined || isNaN(Number(incVotes))) {
    return Promise.reject({
      status: 400,
      msg: `please input valid inc_votes value`,
    });
  }
  const { rows, rowCount } = await db.query(
    "UPDATE reviews SET votes = votes + $1  WHERE review_id = $2 RETURNING *",
    [incVotes, reviewId]
  );
  if (rowCount === 0) {
    return Promise.reject({
      status: 404,
      msg: `no review id = ${reviewId}`,
    });
  }
  return rows[0];
};

exports.fetchCommentsByReviewId = async (reviewId) => {
  if (isNaN(Number(reviewId))) {
    return Promise.reject({
      status: 400,
      msg: `invalid review ID (${reviewId})`,
    });
  }
  await checkExist("reviews", "review_id", reviewId);
  const queryStr = `SELECT * FROM comments WHERE comments.review_id = $1`;
  const { rows } = await db.query(queryStr, [reviewId]);
  return rows;
};

exports.addCommentsByReviewId = async (username, body, reviewId) => {
  if (isNaN(Number(reviewId))) {
    return Promise.reject({
      status: 400,
      msg: `invalid review ID (${reviewId})`,
    });
  }
  if (body === undefined) {
    return Promise.reject({
      status: 400,
      msg: "please provide comment body",
    });
  }
  await checkExist("reviews", "review_id", reviewId);
  await checkExist("users", "username", username);
  const queryStr = `INSERT INTO comments (author, body, review_id)
    VALUES ($1, $2, $3) RETURNING *;`;
  const { rows } = await db.query(queryStr, [username, body, reviewId]);
  return rows[0];
};

exports.fetchReviewById = async (id) => {
  if (isNaN(Number(id))) {
    return Promise.reject({
      status: 400,
      msg: `invalid input ID (${id})`,
    });
  }
  const { rows, rowCount } = await db.query(
    `SELECT reviews.*, COUNT(comments.review_id) AS comment_count FROM reviews
      LEFT JOIN comments ON reviews.review_id = comments.review_id
      WHERE reviews.review_id = $1
      GROUP BY reviews.review_id;`,
    [id]
  );
  if (rowCount === 0) {
    return Promise.reject({
      status: 404,
      msg: `no review id = ${id}`,
    });
  }
  return rows[0];
};

exports.addReview = async (title, owner, review_body, designer, category) => {
  await checkExist("users", "username", owner);
  await checkExist("categories", "slug", category);
  const query = `INSERT INTO reviews (title, owner, review_body, designer, category)
  VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
  const { rows } = await db.query(query, [
    title,
    owner,
    review_body,
    designer,
    category,
  ]);
  const commentsCount = await db.query(
    "SELECT * FROM comments WHERE comments.review_id = $1",
    [rows[0].review_id]
  );
  rows[0].comment_count = commentsCount.rowCount;
  return rows[0];
};
