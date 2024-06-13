const express = require('express');
const router=express.Router();
const ToDoListController= require("../controller/ToDoListController");


router.post("/:idTaskManagement",ToDoListController.createTodoList);
router.get("/:idTaskManagement",ToDoListController.showToDoList);
router.get("/:idTodoList",ToDoListController.getOne);
router.delete("/deleteTodoList/:idTaskManagement/:idTodoList",ToDoListController.deleteToDolist)
router.put("/updateToDolist",ToDoListController.updateToDolist)

module.exports = router;
