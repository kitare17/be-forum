const express = require('express');
const TaskManagementController = require('../controller/TaskManagementController');
const router=express.Router();



router.post("/",TaskManagementController.createTaskManagerment);
router.get("/:userId",TaskManagementController.showTaskManagerment);
router.get("/getOne/:idTaskManagement",TaskManagementController.getOne);
router.delete("/deleteTaskManagement/:idTaskManagement",TaskManagementController.deleteTaskManagerment)
router.put("/updateTaskManagerment",TaskManagementController.updateTaskManagerment)

module.exports = router;
