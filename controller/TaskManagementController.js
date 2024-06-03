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
                (err) => res.json(err)
            )
    }

    async showTaskManagerment(req, res, next) {
        const userId = req.body.idUser;
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
                (err) => {
                    res.json(err)
                }
            )
    }


    async deleteTaskManagerment(req, res, next) {
        const userId = req.body.idUser;
        const idTaskManagement = req.body.idTaskManagement;
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
                        return res.status(404).json({ message: 'not found' })
                    }


                }
            )
            .catch(
                (err) => res.json({ message: err })
            )
    }

    async updateTaskManagerment(req, res, next) {
        const newTask_name = req.body.taskName;
        const newCreateAt = new Date(req.body.createAt);
        newCreateAt.setDate(newCreateAt.getDate() + 1);
        const newCreateAtISO = newCreateAt.toISOString();

        const newUpdateAt = new Date(req.body.updateAt);
        newUpdateAt.setDate(newUpdateAt.getDate() + 1);
        const newUpdateAtISO = newUpdateAt.toISOString();

        const userId = req.body.idUser;
        const idTaskManagement = req.body.idTaskManagement;
        await TaskManagement.findOne({ "_id": idTaskManagement })
            .populate({
                path: 'user',
                select: 'username fullname'
            })
            .then(async (taskManagement) => {
                if (taskManagement && taskManagement.user._id.toString() === userId) {
                    const updateData = {
                        task_name: newTask_name || taskManagement.task_name,
                        createAt: newCreateAtISO || taskManagement.createAt,
                        updateAt: newUpdateAtISO || taskManagement.updateAt,
                    }
                    console.log(updateData)
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
                (err) => res.json({ message: err })
            )
    }

}

module.exports = new TaskManagementController();