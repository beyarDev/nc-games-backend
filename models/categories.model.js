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
