const db = require("../db/connection");

exports.fetchCategories = () => {
  return db
    .query("SELECT slug, description FROM categories")
    .then(({ rows }) => {
      // here i am destructuring rows from query result comming back from database
      return rows;
    });
};


