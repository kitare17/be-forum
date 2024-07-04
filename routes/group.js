const express = require('express');
const router = express.Router();
const GroupController = require("../controller/GroupController");
const {verifyAdmin} = require("../config/jwt/authentication")


router.post("/", GroupController.createGroup);
router.get("/:slug", GroupController.showOneGroup);
router.get("/", GroupController.showAllGroup);

router.post("/notification", GroupController.createGroupNotification)
router.delete("/notification/:notificationId", GroupController.removeNotification)
router.delete("/:groupId", GroupController.removeGroup)
router.get("/:groupId/notifications", GroupController.showAllNotification)

router.get("/:groupId/members", GroupController.getMemberGroup)
router.put("/:groupId/members", GroupController.joinGroup)
router.delete("/:groupId/members", GroupController.removeMemberGroup)
router.get("/query/find", GroupController.findGroup);

router.post("/docs/add", GroupController.createDoc);
router.get("/:groupId/docs/get", GroupController.getDocGroup);
router.delete("/:groupId/docs/:docId",GroupController.deleteDoc);

router.post("/:groupId/tasks",GroupController.createTaskGroup);
router.get("/:groupId/tasks",GroupController.getTaskGroup);
router.put("/:groupId/tasks/:taskId",GroupController.updateTaskGroup);


module.exports = router;
