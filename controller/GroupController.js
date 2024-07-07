const Group = require("../model/Group");
const GroupNotificaton = require("../model/GroupNotification");
const DocShare = require("../model/DocShare");
const TaskGroup = require("../model/TaskGroup");

const Post = require("../model/Post");

class GroupController {
    async createGroup(req, res, next) {
        const groupDataBody = req.body;
        const newGroup = new Group(groupDataBody);
        await newGroup.save()
            .then(
                (group) => {
                    group.populate({
                        path: 'adminGroup',
                        select: 'username fullname'
                    })
                        .then(
                            (resData) => {
                                return res.json(resData);

                            }
                        )

                }
            )
            .catch(
                (err) => res.json(err)
            )
    }

    async showOneGroup(req, res, next) {
        const slug = req.params.slug;
        await Group.findOne({"slug": slug})
            .populate({
                path: 'adminGroup',
                select: 'username fullname'
            })
            .populate({
                path: 'members',
                select: 'username fullname'
            })
            .then(
                (group) => {
                    res.json(group)
                }
            )
            .catch(
                err => {
                    res.json(err)
                }
            )
    }

    async showAllGroup(req, res, next) {
        var page = req.query.page || 1;
        var limitPage = 12;
        var totalPosts = await Group.countDocuments();
        var maxPage = Math.ceil(totalPosts / limitPage);
        await Group
            .find()
            .sort({createdAt: -1})
            .skip((page - 1) * limitPage)
            .limit(limitPage)
            .populate({
                path: 'adminGroup',
                select: 'username fullname'
            })
            .then(
                (groups) => {
                    res.json({
                            groups: groups,
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


    async createGroupNotification(req, res, next) {
        const groupNotificationDataBody = req.body;
        const newGroupNotification = new GroupNotificaton(groupNotificationDataBody);
        await newGroupNotification.save()
            .then(
                (groupNotification) => {
                    groupNotification.populate({
                        path: 'group',
                    })
                        .then(
                            (resData) => {
                                return res.json(resData);

                            }
                        )

                }
            )
            .catch(
                (err) => res.json(err)
            )
    }


    async showAllNotification(req, res, next) {
        var groupId = req.params.groupId;
        var page = req.query.page || 1;
        var limitPage = 6;
        var totalNotification = await GroupNotificaton.countDocuments();
        var maxPage = Math.ceil(totalNotification / limitPage);
        await GroupNotificaton
            .find({"group": groupId})
            .sort({createdAt: -1})
            .skip((page - 1) * limitPage)
            .limit(limitPage)
            .then(
                (notifications) => {
                    res.json({
                            notifications: notifications,
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


    async removeNotification(req, res, next) {
        const notificationId = req.params.notificationId;
        GroupNotificaton.remove({"_id": notificationId})
            .then((post) => {
                res.status(200).json(
                    {
                        message: "Xóa thông báo thành công"
                    }
                )
            })
            .catch((err) => {
                res.status(500).json(
                    {
                        err: err,
                        message: "Xóa thông báo không thành công"
                    }
                )
            })
    }

    async removeGroup(req, res, next) {
        const groupId = req.params.groupId;
        Group.remove({"_id": groupId})
            .then((group) => {
                res.status(200).json(
                    {
                        message: "Xóa nhóm thành công"
                    }
                )
            })
            .catch((err) => {
                res.status(500).json(
                    {
                        err: err,
                        message: "Xóa nhóm không thành công"
                    }
                )
            })
    }

    async getMemberGroup(req, res, next) {
        const groupId = req.params.groupId;
        Group.findOne({"_id": groupId})
            .populate({
                path: 'adminGroup',
                select: 'username fullname'
            })
            .populate({
                path: 'members',
                select: 'username fullname'
            })
            .then((group) => {

                if (group)

                    res.status(200).json(
                        {
                            members: group.members
                        }
                    )
            })
            .catch((err) => {
                res.status(500).json(
                    {
                        err: err,
                        message: "Xóa nhóm không thành công"
                    }
                )
            })
    }

    async joinGroup(req, res, next) {
        const groupId = req.params.groupId;
        const userId = req.body.userId;
        const password = req.body.password;


        Group.findOne({"_id": groupId, "password": password})

            .then((group) => {

                if (group)

                    if (!group.members.includes(userId)) {
                        group.members = [...group.members, userId]
                        group.save()

                    }
                res.status(200).json(
                    {
                        members: group.members
                    }
                )


            })
            .catch((err) => {
                res.status(500).json(
                    {
                        err: err,
                        message: "Mật khẩu không chính xác vui lòng thử lại!!!"
                    }
                )
            })
    }

    async removeMemberGroup(req, res, next) {
        const groupId = req.params.groupId;
        const userId = req.body.userId;
        Group.findOne({"_id": groupId})

            .then((group) => {

                if (group)

                    if (group.members.includes(userId)) {
                        var indexNember = group.members.indexOf(userId)
                        console.log(indexNember)
                        group.members.splice(indexNember, 1)
                        group.save()

                    }
                res.status(200).json(
                    {
                        members: group.members
                    }
                )


            })
            .catch((err) => {
                res.status(500).json(
                    {
                        err: err
                    }
                )
            })
    }

    async findGroup(req, res, next) {
        const groupName = req.query.groupName;
        var page = req.query.page || 1;
        var limitPage = 12;
        var totalPosts = await Group.find({groupName: {$regex: '.*' + groupName + '.*'}}).countDocuments();
        var maxPage = Math.ceil(totalPosts / limitPage);

        Group.find({groupName: {$regex: '.*' + groupName + '.*'}})
            .sort({createdAt: -1})
            .skip((page - 1) * limitPage)
            .limit(limitPage)
            .populate({
                path: 'adminGroup',
                select: 'username fullname'
            })
            .then((groups) => {
                console.log("groupName ", groupName)
                res.json({
                    groups: groups,
                    maxPage: maxPage
                })
            })
            .catch((err) => {
                console.log(err)
                res.status(500).json(
                    {
                        err: err
                    }
                )
            })
    }

    async getDocGroup(req, res, next) {
        const groupId = req.params.groupId;
        DocShare.find({"group": groupId})
            .then((docs) => {
                if (docs)
                    res.status(200).json(
                        {
                            docs: docs
                        }
                    )
                else {
                    res.status(200).json(
                        {
                            message: "not found"
                        }
                    )
                }
            })
            .catch((err) => {
                res.status(500).json(
                    {
                        err: err
                    }
                )
            })
    }

    async createDoc(req, res, next) {
        const groupDataBody = req.body;
        const newDoc = new DocShare(groupDataBody);
        await newDoc.save()
            .then(
                (doc) => {
                    doc.populate({
                        path: 'group',
                    })
                        .then(
                            (resData) => {
                                return res.json(resData);

                            }
                        )

                }
            )
            .catch(
                (err) => res.json(err)
            )
    }

    async deleteDoc(req, res, next) {
        const docId = req.params.docId;
        const groupId = req.params.groupId;
        DocShare.deleteOne({"_id": docId})
            .then(doc => {
                DocShare.find({"group": groupId})
                    .then((docs) => {
                        if (docs)
                            res.status(200).json(
                                {
                                    docs: docs,
                                    message: "Xóa tài liệu thành công"
                                }
                            )
                        else {
                            res.status(200).json(
                                {
                                    message: "not found"
                                }
                            )
                        }
                    })
                    .catch((err) => {
                        res.status(500).json(
                            {
                                err: err
                            }
                        )
                    })
            })
            .catch(err => {
                res.status(500).json({
                    err: err
                })
            })

    }

    async createTaskGroup(req, res, next) {
        const groupDataBody = req.body;
        const newTask = new TaskGroup(groupDataBody);
        await newTask.save()
            .then(
                (task) => {
                    task.populate({
                        path: 'assignee',
                        select: "username fullname"
                    })
                        .then(
                            (resData) => {
                                return res.json(resData);

                            }
                        )

                }
            )
            .catch(
                (err) => res.json(err)
            )
    }


    async getTaskGroup(req, res, next) {
        const groupId = req.params.groupId;
        TaskGroup.find({"group": groupId})
            .populate({
                path: "assignee",
                select: 'username fullname'
            })

            .then((tasks) => {
                if (tasks)
                    res.status(200).json(
                        {
                            tasks: tasks
                        }
                    )
                else {
                    res.status(200).json(
                        {
                            message: "not found"
                        }
                    )
                }
            })
            .catch((err) => {
                res.status(500).json(
                    {
                        err: err
                    }
                )
            })
    }


    async updateTaskGroup(req, res, next) {
        var groupId = req.params.groupId;
        const {
            title,
            detail,
            assignee,
            label,
            startDate,
            endDate,
            status
        } = req.body
        const taskId = req.params.taskId;
        TaskGroup.findOne({"_id": taskId})


            .then((task) => {
                if (task) {

                    task.title = title;
                    task.detail = detail;
                    task.status = status;
                    task.assignee = assignee;
                    task.label = label;
                    task.startDate = startDate;
                    task.endDate = endDate;

                    task.save()
                    res.status(200).json(
                        {
                            task: task
                        }
                    )
                } else {
                    res.status(200).json(
                        {
                            message: "not found"
                        }
                    )
                }
            })
            .catch((err) => {
                res.status(500).json(
                    {
                        err: err
                    }
                )
            })
    }
}

module.exports = new GroupController();