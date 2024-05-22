const express = require('express');
const router=express.Router();
const reportBlogController= require("../controller/ReportBlogController");
const {verifyAdmin}=require("../config/jwt/authentication")


router.post("/",reportBlogController.createReportBlog);
router.get("/",reportBlogController.showReportBlog);


// router.get("/",postController.showPost);
// router.get("/:idPost",postController.getOne);
// router.put("/:idPost/comments",postController.addComment);
// router.put("/:idPost/likes",postController.likePost)
// router.put("/:idPost/unlikes",postController.unlikePost)

module.exports = router;