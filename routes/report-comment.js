const express = require('express');
const router=express.Router();
const reportCommentController= require("../controller/ReportCommentController");
const {verifyAdmin}=require("../config/jwt/authentication")


router.post("/",reportCommentController.createReportComment);
router.get("/",reportCommentController.showReportComment);
router.get("/show/blog",reportCommentController.showReportFollowStatusBlog);
router.get("/status",reportCommentController.showReportCommentByStatus);
router.put("/:reportId/choice-accept",reportCommentController.deleteCommentChoice);
router.put("/:reportId/choice-cancel",reportCommentController.cancelChoice);


// router.get("/",postController.showPost);
// router.get("/:idPost",postController.getOne);
// router.put("/:idPost/comments",postController.addComment);
// router.put("/:idPost/likes",postController.likePost)
// router.put("/:idPost/unlikes",postController.unlikePost)

module.exports = router;