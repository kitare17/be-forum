const express = require('express');

const dishesRouter = require("./dishes");
const promotionsRouter = require("./promotions");
const leadersRouter = require("./leaders");
//
// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

function routers(app) {
    app.use("/dishes", dishesRouter);
    app.use("/promotions", promotionsRouter);
    app.use("/leaders", leadersRouter);
}

module.exports = routers;
