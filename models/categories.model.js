const db = require("../db/connection");

exports.fetchCategories = async () => {
  const { rows } = await db.query("SELECT slug, description FROM categories");
  return rows;
};
