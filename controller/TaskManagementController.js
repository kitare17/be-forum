const TaskManagement = require("../model/TaskManagement")
const TodoList = require("../model/TodoList")

class TaskManagementController {
    async createTaskManagerment(req, res, next) {
        const taskManagermentData = req.body;
        const newtaskManagermentData = new TaskManagement(taskManagermentData);
        await newtaskManagermentData.save()
            .then(
                (post) => {
                    res.json(post);
                }
            )
            .catch(
                (error) => {
                    res.json({
                        error: "404"
                    })
                }
            )
    }

    async showTaskManagerment(req, res, next) {
        const userId = req.params.userId;
        var page = req.query.page || 1;
        var limitPage = 6;
        var totalTaskManagement = await TaskManagement.countDocuments();
        var maxPage = Math.ceil(totalTaskManagement / limitPage);
        await TaskManagement
            .find({ user: userId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limitPage)
            .limit(limitPage)
            .populate({
                path: 'user',
                select: 'username fullname'

            })
            .then(
                (taskManagement) => {
                    res.status(200).json({
                        taskManagement: taskManagement,
                        maxPage: maxPage
                    }

                    )
                }
            )
            .catch(
                (error) => {
                    res.json({
                        error: "404"
                    })
                }
            )
    }

    async getOne(req, res, next) {
        const id = req.params.idTaskManagement;
        await TaskManagement.findOne({ "_id": id })
            .populate({
                path: 'user',
                select: 'username fullname'

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


    async deleteTaskManagerment(req, res, next) {
        const idTaskManagement = req.params.idTaskManagement;
        await TaskManagement.findOne({ "_id": idTaskManagement })
            .populate({
                path: 'user',
                select: 'username fullname'
            })
            .then(
                async (taskManagement) => {
                    if (!taskManagement) {
                        return res.status(404).json({ message: 'Task management not found' });
                    } else if (taskManagement) {
                        const idTodoList = taskManagement.todoList
                        const idTodoListArr = idTodoList.map(id => id.toString())
                        const result = idTodoListArr.map(async (item) => {
                            await TodoList.deleteMany({ "_id": item })
                        });
                        await taskManagement.deleteOne({ "_id": idTaskManagement })
                        res.status(200).json({
                            message: 'TaskManagement deleted successfully',
                        });

                    } else {
                        (error) => {
                            res.json({
                                error: "not found"
                            })
                        }
                    }


                }
            )
            .catch(
                (error) => {
                    res.json({
                        error: "404"
                    })
                }
            )
    }

    async updateTaskManagerment(req, res, next) {
        const newTask_name = req.body.taskName;
        const newUpdateAt = req.body.updateAt;
        const idTaskManagement = req.body.idTaskManagement;
        await TaskManagement.findOne({ "_id": idTaskManagement })
            .populate({
                path: 'user',
                select: 'username fullname'
            })
            .then(async (taskManagement) => {
                if (taskManagement) {
                    const updateData = {
                        taskName: newTask_name || taskManagement.taskName,
                        updateAt: newUpdateAt,
                    }
                    const resilt = await TaskManagement.updateOne(
                        { _id: idTaskManagement },
                        { $set: updateData }
                    );

                    res.status(200).json({
                        taskManagement: taskManagement,
                        message: "Update success"
                    }
                    )

                } else {
                    res.status(404).json({ message: "Task is not found" });
                }
            }
            )
            .catch(
                (error) => {
                    res.json({
                        error: error
                    })
                }
            )
    }

}

module.exports = new TaskManagementController();