const express = require('express');
const router=express.Router();
const postController= require("../controller/PostController");
const {verifyAdmin}=require("../config/jwt/authentication")


router.post("/",postController.createPost);
router.get("/",postController.showPost);


module.exports = router;
