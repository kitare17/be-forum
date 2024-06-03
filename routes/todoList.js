const express = require('express');
const router=express.Router();
const ToDoListController= require("../controller/ToDoListController");


router.post("/",ToDoListController.createTodoList);
router.get("/",ToDoListController.showToDoList);
router.get("/:idTodoList",ToDoListController.getOne);
router.delete("/deleteTodoList",ToDoListController.deleteToDolist)
router.put("/updateToDolist",ToDoListController.updateToDolist)

module.exports = router;
