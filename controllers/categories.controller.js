const { fetchCategories } = require("../models/categories.model");

exports.etCategories = (req, res) => {
  fetchCategories();
};
