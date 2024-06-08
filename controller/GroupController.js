const Group = require("../model/Group");
const GroupNotificaton=require("../model/GroupNotification");

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
        var groupId=req.params.groupId;
        var page = req.query.page || 1;
        var limitPage = 6;
        var totalNotification = await GroupNotificaton.countDocuments();
        var maxPage = Math.ceil(totalNotification / limitPage);
        await GroupNotificaton
            .find({"group":groupId})
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
        const notificationId=req.params.notificationId;
        GroupNotificaton.remove({"_id": notificationId})
            .then((post)=>{
                res.status(200).json(
                    {
                        message:"Xóa thông báo thành công"
                    }
                )
            })
            .catch((err)=>{
                res.status(500).json(
                    {
                        err:err,
                        message:"Xóa thông báo không thành công"
                    }
                )
            })
    }

    async removeGroup(req, res, next) {
        const groupId=req.params.groupId;
        Group.remove({"_id": groupId})
            .then((post)=>{
                res.status(200).json(
                    {
                        message:"Xóa nhóm thành công"
                    }
                )
            })
            .catch((err)=>{
                res.status(500).json(
                    {
                        err:err,
                        message:"Xóa nhóm không thành công"
                    }
                )
            })
    }










}

module.exports = new GroupController();
