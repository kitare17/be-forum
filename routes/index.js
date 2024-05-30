const usersRouter = require("./users");
const postsRouter = require("./posts");
const salePostsRouter = require("./saleposts");
const categoriesRouter = require("./categories");
const topicsRouter = require("./topics");
const todoListRouter = require("./todoList");
const reportBlogRouter = require("./report-blog");
const reportCommentRouter = require("./report-comment");


function routers(app) {
    app.use("/users", usersRouter);
    app.use("/posts", postsRouter);
    app.use("/saleposts", salePostsRouter);
    app.use("/categories", categoriesRouter);
    app.use("/topics", topicsRouter);
    app.use("/todoList", todoListRouter);
    app.use("/report-blog", reportBlogRouter);
    app.use("/report-comment", reportCommentRouter);

}

module.exports = routers;
