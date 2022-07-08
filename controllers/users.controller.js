const { fetchUsers, fetchUserByName } = require("../models/users.models");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await fetchUsers();
    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
};

exports.getUserByName = async (req, res, next) => {
  const { username } = req.params;
  try {
    const user = await fetchUserByName(username);
    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};
