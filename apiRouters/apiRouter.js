const apiRouter = require("express").Router();
const commentsRouter = require("./commentsRouter");
const reviewsRouter = require("./reviewsRouter");
const usersRouter = require("./usersRouter");
const categoriesRouter = require("./categoriesRouter");
const endpoints = require("../endpoints.json");

apiRouter.get("/", (req, res) => {
  res.status(200).send({ endpoints });
});

apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
