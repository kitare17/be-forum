var express = require('express');
var router = express.Router();
var userController=require('../controller/UserController')
var {authentication,verifyAdmin}=require("../config/jwt/authentication")
/* GET users listing. */
router.get('/', userController.show);
router.post('/register',userController.create)
router.post("/login",userController.login)
router.put("/update-profile/:userId",userController.updateProfile)
router.get("/detail-user/:userId",userController.getDetailUser)
router.put("/update-password",userController.updatePassword)
router.get("/check",authentication);
module.exports = router;
