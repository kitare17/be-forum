const express = require('express');
const router=express.Router();
const GroupController= require("../controller/GroupController");
const {verifyAdmin}=require("../config/jwt/authentication")


router.post("/",GroupController.createGroup);
router.get("/:slug",GroupController.showOneGroup);
router.get("/",GroupController.showAllGroup);
router.post("/notification",GroupController.createGroupNotification)
router.delete("/notification/:notificationId",GroupController.removeNotification)
router.delete("/:groupId",GroupController.removeGroup)
router.get("/:groupId/notifications",GroupController.showAllNotification)

router.get("/:groupId/members",GroupController.getMemberGroup)
router.put("/:groupId/members",GroupController.joinGroup)
module.exports = router;
