const usersRouter = require("./users");
const postsRouter = require("./posts");
const salePostsRouter = require("./saleposts");
const categoriesRouter = require("./categories");
const topicsRouter = require("./topics");
const deckRouter = require("./decks");
// const testRouter = require("./test");

const quizRouter = require("./quiz");

function routers(app) {
  app.use("/users", usersRouter);
  app.use("/posts", postsRouter);
  app.use("/saleposts", salePostsRouter);
  app.use("/categories", categoriesRouter);
  app.use("/topics", topicsRouter);
  app.use("/deck", deckRouter);
  app.use("/quizzes", quizRouter);
  // app.use("/quiz/test", testRouter);
}

module.exports = routers;
