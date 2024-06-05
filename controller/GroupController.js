const Group = require("../model/Group");



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
        var limitPage = 6;
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
}

module.exports = new GroupController();
