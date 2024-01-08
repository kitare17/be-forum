var express = require('express');

var dishesRouter=require("./dishes");
var promotionsRouter=require("./promotions");
//
// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

function routers(app){
   app.use("/dishes",dishesRouter);
   app.use("/promotions",promotionsRouter);
}

module.exports = routers;
