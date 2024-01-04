var express = require('express');
var router = express.Router();
var dishesRouter=require("./dishes")
//
// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

function routers(app){
   app.use("/dishes",dishesRouter);
}

module.exports = routers;
