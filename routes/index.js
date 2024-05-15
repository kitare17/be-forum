const usersRouter = require("./users");
const postsRouter = require("./posts");
const salePostsRouter = require("./saleposts");
const categoriesRouter = require("./categories");

function routers(app) {
    app.use("/users", usersRouter);
    app.use("/posts", postsRouter);
    app.use("/saleposts", salePostsRouter);
    app.use("/categories", categoriesRouter);
}

module.exports = routers;
