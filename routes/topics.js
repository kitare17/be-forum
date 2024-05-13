const express = require('express');
const router=express.Router();
const topicController= require("../controller/TopicController");
const {verifyAdmin}=require("../config/jwt/authentication")


router.post("/",topicController.createTopic);
router.get("/",topicController.showPost);

// router.get("/:idPost",postController.getOne);
// router.put("/:idPost/comments",postController.addComment);


module.exports = router;
