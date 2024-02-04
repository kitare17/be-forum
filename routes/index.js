const usersRouter = require("./users");
const postsRouter = require("./posts");

function routers(app) {
    app.use("/users", usersRouter);
    app.use("/posts", postsRouter);
}

module.exports = routers;
