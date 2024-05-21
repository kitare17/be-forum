const usersRouter = require("./users");
const postsRouter = require("./posts");
const topicsRouter = require("./topics");
const todoListRouter = require("./todoList");

function routers(app) {
    app.use("/users", usersRouter);
    app.use("/posts", postsRouter);
    app.use("/topics", topicsRouter);
    app.use("/todoList", todoListRouter);

}

module.exports = routers;
