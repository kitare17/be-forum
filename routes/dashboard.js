var express = require('express');
var router = express.Router();
var dashboardController=require('../controller/DashboardController')
var {authentication,verifyAdmin}=require("../config/jwt/authentication")
/* GET users listing. */
router.get('/totalUser', dashboardController.getTotalUser);
router.get('/blogMonth', dashboardController.getAmountBlogMonth);
router.get('/report', dashboardController.getTotalReport);

module.exports = router;
