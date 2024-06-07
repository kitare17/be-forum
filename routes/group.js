const express = require('express');
const router=express.Router();
const GroupController= require("../controller/GroupController");
const {verifyAdmin}=require("../config/jwt/authentication")


router.post("/",GroupController.createGroup);
router.get("/:slug",GroupController.showOneGroup);
router.get("/",GroupController.showAllGroup);
// router.get("/",topicController.showTopic);
// router.get("/:slug",topicController.showTopicDetail)
// router.get("/:idPost",postController.getOne);
// router.put("/:idPost/comments",postController.addComment);

router.post("/notification",GroupController.createGroupNotification)
router.delete("/notification/:notificationId",GroupController.removeNotification)
router.delete("/:groupId",GroupController.removeGroup)
module.exports = router;
