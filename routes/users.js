var express = require('express');
var router = express.Router();
var userController=require('../controller/UserController')
var {authentication,verifyAdmin}=require("../config/jwt/authentication")
/* GET users listing. */
router.get('/',verifyAdmin, userController.show);
router.post('/register',userController.create)
router.post("/login",userController.login)
router.put("/update-profile",userController.updateProfile)
router.get("/check",authentication);
module.exports = router;
