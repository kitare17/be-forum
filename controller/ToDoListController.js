const TodoList = require("../model/TodoList")

class ToDoListController {


    async createTodoList(req, res, next) {
        const todoListData = req.body;
        const newToDoList = new TodoList(todoListData);
        await newToDoList.save()
            .then(
                (post) => {
                    res.json(post);
                }
            )
            .catch(
                (err) => res.json(err)
            )
    }

    async showToDoList(req, res, next) {
        const userId = req.body.idUser;
        var page = req.query.page || 1;
        var limitPage = 6;
        var totalToDoList = await TodoList.countDocuments();
        var maxPage = Math.ceil(totalToDoList / limitPage);
        await TodoList
            .find({ user: userId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limitPage)
            .limit(limitPage)
            .populate({
                path: 'user',
                select: 'username fullname'

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


    async deleteToDolist(req, res, next) {
        const userId = req.body.idUser;
        const id = req.body.idTodoList;
        await TodoList.findOne({ "_id": id })
            .populate({
                path: 'user',
                select: 'username fullname'
            })
            .then(
                async (todoList) => {
                    if (!todoList) {
                        return res.status(404).json({ message: 'Todo list not found' });
                    } else if (todoList.user._id.toString() === userId) {
                        await TodoList.deleteOne({ "_id": id })
                        return res.status(200).json({ message: 'Todo list deleted successfully' });
                    } else {
                        return res.status(404).json({ message: 'Not found' })
                    }
                }
            )
            .catch(
                (err) => res.json(err)
            )
    }


}

module.exports = new ToDoListController();