const TodoList = require("../model/TodoList")
const TaskManagement = require("../model/TaskManagement")


class ToDoListController {


    async createTodoList(req, res, next) {
        try {
            const todoListData = req.body;
            const idTaskManagement = req.body.idTaskManagement;
            const taskManagement = await TaskManagement.findById(idTaskManagement);
            if (!taskManagement) {
                return res.status(404).json({ message: 'Task management not found' });
            } else {
                const newToDoList = new TodoList(todoListData);
                const tdoList = await newToDoList.save();
                taskManagement.todoList.push(tdoList._id);
                await taskManagement.save();
                return res.status(201).json({ message: 'Add success', todoList: tdoList });
            }
        } catch (err) {
            return res.status(500).json({ message: 'Server error', error: err });
        }
    }
    
    async showToDoList(req, res, next) {
        const userId = req.body.idUser;
        const idTaskManagement = req.body.idTaskManagement;
        var page = req.query.page || 1;
        var limitPage = 6;
        var totalToDoList = await TodoList.countDocuments();

        var maxPage = Math.ceil(totalToDoList / limitPage);
        await TodoList
            .find({ user: userId })
            .find({ taskManagement: idTaskManagement })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limitPage)
            .limit(limitPage)
            .populate({
                path: 'user',
                select: 'username'

            })
            .populate({
                path: 'taskManagement',
                select: 'task_name'

            })
            .then(
                (todoList) => {
                    res.status(200).json({
                        todoList: todoList,
                        maxPage: maxPage
                    }

                    )
                }
            )
            .catch(
                (err) => {
                    res.json(err)
                }
            )
    }

    async getOne(req, res, next) {
        const id = req.params.idTodoList;
        await TodoList.findOne({ "_id": id })
            .populate({
                path: 'user',
                select: 'username fullname'

            })
            .populate({
                path: 'taskManagement',
                select: 'task_name'

            })
            .then(
                (post) => {
                    res.json(post)
                }
            )
            .catch(
                err => {
                    err
                }
            )
    }

    async updateToDolist(req, res, next) {
        const idTodolist = req.body.idTodolist;
        const title = req.body.title;
        const detail = req.body.detail;
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(req.body.endDate);
        const label = req.body.label;
        const status = req.body.status;
        const prioritize = req.body.prioritize;

        try {
            // Tìm TodoList và thực hiện populate
            const todoList = await TodoList.findOne({ _id: idTodolist })
                .populate({
                    path: 'user',
                    select: 'username fullname'
                })

            if (todoList) {
                todoList.title = title || todoList.title;
                todoList.detail = detail || todoList.detail;
                todoList.startDate = startDate || todoList.startDate;
                todoList.endDate = endDate || todoList.endDate;
                todoList.label = label || todoList.label;
                todoList.status = status || todoList.status;
                todoList.prioritize = prioritize || todoList.prioritize;
                await todoList.save();

                res.json({
                    message: "Update success",
                    todoList
                });
            } else {
                res.status(404).json({ message: "TodoList not found" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }



    async deleteToDolist(req, res, next) {
        const idTaskManagement = req.body.idTaskManagement;
        const userId = req.body.idUser;
        const idTodoList = req.body.idTodoList;
        let messageTodo = "";
        let messageTask = "";
        try {
            await TaskManagement.findOne({ "_id": idTaskManagement })
                .populate({
                    path: 'user',
                    select: 'username fullname'
                })
                .then(
                    async (taskManagement) => {
                        if (!taskManagement) {
                            return res.status(404).json({ message: 'Task management not found' });
                        } else if (taskManagement.user._id.toString() === userId) {
                            const todoListArr = taskManagement.todoList
                            const idTodoListTask = todoListArr.map(id => id.toString())
                            const result = idTodoListTask.map(async (item, index) => {
                                if (item === idTodoList) {
                                    await TaskManagement.updateOne(
                                        { _id: idTaskManagement },
                                        { $pull: { todoList: idTodoList } }
                                    );
                                    return messageTask = 'To do list in task delete successfully'
                                }
                            });
                        } else {
                            res.status(500).json({ error: "Task is not exist" });
                        }


                    })


            await TodoList.findOne({ "_id": idTodoList })
                .populate({
                    path: 'user',
                    select: 'username fullname'
                })
                .then(
                    async (todoList) => {
                        if (!todoList) {
                            messageTodo = 'Todo list not found'; return
                        } else if (todoList.user._id.toString() === userId) {
                            await TodoList.deleteOne({ "_id": idTodoList })
                            return messageTodo = 'Todo list deleted successfully';
                        } else {
                            res.status(500).json({ error: "Todo list is not exist" });

                        }
                    }
                )

            res.status(200).json({
                messageTodo: messageTodo,
                messageTask: messageTask
            })
        } catch (err) {
            res.json(err)
        }
    }


}

module.exports = new ToDoListController();