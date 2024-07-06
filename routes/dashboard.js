var express = require('express');
var router = express.Router();
var dashboardController=require('../controller/DashboardController')
var {authentication,verifyAdmin}=require("../config/jwt/authentication")
/* GET users listing. */
router.get('/totalUser', dashboardController.getTotalUser);
router.get('/blogMonth', dashboardController.getAmountBlogMonth);
router.get('/report', dashboardController.getTotalReport);
router.get('/find/blog', dashboardController.findPost);
router.get('/getAll/blog', dashboardController.showPost);
router.put('/edit/blog/:postId', dashboardController.updateStatusPost);
router.get('/getAmount7Months', dashboardController.getAmountBlog7Days);

module.exports = router;
