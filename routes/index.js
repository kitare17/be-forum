const usersRouter = require("./users");
const postsRouter = require("./posts");
const salePostsRouter = require("./saleposts");
const categoriesRouter = require("./categories");
const topicsRouter = require("./topics");
const todoListRouter = require("./todoList");
const taskManagementRouter = require("./TaskManagement");
const reportBlogRouter = require("./report-blog");
const reportCommentRouter = require("./report-comment");
const groupRouter = require("./group");
const searchRouter = require("./search")
const wishListRouter = require("./wishlist")
const dashboardRouter = require("./dashboard");


function routers(app) {
    app.use("/users", usersRouter);
    app.use("/posts", postsRouter);
    app.use("/saleposts", salePostsRouter);
    app.use("/categories", categoriesRouter);
    app.use("/topics", topicsRouter);
    app.use("/todoList", todoListRouter);
    app.use("/taskManagement", taskManagementRouter);
    app.use("/report-blog", reportBlogRouter);
    app.use("/report-comment", reportCommentRouter);
    app.use("/groups", groupRouter);
    app.use("/search",searchRouter);
    app.use("/wishlists",wishListRouter);
    app.use("/dashboard", dashboardRouter);
}

module.exports = routers;
