const db = require("../db/connection");
const { checkExist } = require("../db/seeds/utils");

exports.fetchUsers = async () => {
  const queryStr = "SELECT username, name, avatar_url FROM users";
  const { rows } = await db.query(queryStr);
  return rows;
};
