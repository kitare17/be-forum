var express = require('express');
var router = express.Router();
var userController=require('../controller/UserController')
var {authentication,verifyAdmin}=require("../config/jwt/authentication")
/* GET users listing. */
router.get('/',verifyAdmin, userController.show);
router.post('/',userController.create)
router.get("/login",userController.login)
router.get("/check",authentication);
module.exports = router;
