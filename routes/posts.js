const express = require('express');
const router=express.Router();
const postController= require("../controller/PostController");
const {verifyAdmin}=require("../config/jwt/authentication")


router.post("/",postController.createPost);
router.get("/",postController.showPost);
router.get("/:idPost",postController.getOne);
router.get("/:idPost/status",postController.checkStatus);
router.put("/:idPost/comments",postController.addComment);
router.put("/:idPost/likes",postController.likePost)
router.put("/:idPost/unlikes",postController.unlikePost)
router.post("/replyComment",postController.relyComment);
router.put("/editDetail",postController.editDetail);
router.delete("/:idPost",postController.removePost);
router.delete("/:idPost/comments/:commentId",postController.removeComment);

module.exports = router;
