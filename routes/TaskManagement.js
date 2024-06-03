const express = require('express');
const router=express.Router();
const TaskManagementController= require("../controller/taskManagementController");


router.post("/",TaskManagementController.createTaskManagerment);
router.get("/",TaskManagementController.showTaskManagerment);
router.delete("/deleteTaskManagement",TaskManagementController.deleteTaskManagerment)
router.put("/updateTaskManagerment",TaskManagementController.updateTaskManagerment)

module.exports = router;
