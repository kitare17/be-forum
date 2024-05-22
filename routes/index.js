const usersRouter = require("./users");
const postsRouter = require("./posts");
const salePostsRouter = require("./saleposts");
const categoriesRouter = require("./categories");
const topicsRouter = require("./topics");


function routers(app) {
    app.use("/users", usersRouter);
    app.use("/posts", postsRouter);
    app.use("/saleposts", salePostsRouter);
    app.use("/categories", categoriesRouter);
    app.use("/topics", topicsRouter);

}

module.exports = routers;
