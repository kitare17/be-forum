const express = require('express');
const router=express.Router();
const postController= require("../controller/PostController");
const {verifyAdmin}=require("../config/jwt/authentication")


router.post("/",postController.createPost);
router.get("/",postController.showPost);
router.get("/:idPost",postController.getOne);
router.put("/:idPost/comments",postController.addComment);
router.put("/:idPost/likes",postController.likePost)
router.put("/:idPost/unlikes",postController.unlikePost)
router.post("/replyComment",postController.relyComment);
module.exports = router;
