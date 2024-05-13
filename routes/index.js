const usersRouter = require("./users");
const postsRouter = require("./posts");
const topicsRouter = require("./topics");

function routers(app) {
    app.use("/users", usersRouter);
    app.use("/posts", postsRouter);
    app.use("/topics", topicsRouter);
}

module.exports = routers;
