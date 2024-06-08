const express = require('express');
const router=express.Router();
const topicController= require("../controller/TopicController");
const {verifyAdmin}=require("../config/jwt/authentication")


router.post("/",topicController.createTopic);
router.get("/",topicController.showTopic);
router.get("/:slug",topicController.showTopicDetail)
// router.get("/:idPost",postController.getOne);
// router.put("/:idPost/comments",postController.addComment);


module.exports = router;
