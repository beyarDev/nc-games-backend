const db = require("../db/connection");
const { checkExist } = require("../db/seeds/utils");

exports.fetchUsers = async () => {
  const queryStr = "SELECT username, name, avatar_url FROM users";
  const { rows } = await db.query(queryStr);
  return rows;
};

exports.fetchUserByName = async (username) => {
  // const queryStr = "SELECT * FROM users WHERE username = $1";
  // const { rows } = await db.query(queryStr, [username]);
  const { rows } = await checkExist("users", "username", username);
  return rows[0];
};
