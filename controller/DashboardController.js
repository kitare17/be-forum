const User = require("../model/User");
const Post = require("../model/Post");
const ReportBlog = require("../model/ReportBlog");
const ReportComment = require("../model/ReportComment");

class DashboardController {

    async showPost(req, res, next) {
        var page = req.query.page || 1;
        var limitPage = 6;
        var totalPosts = await Post.countDocuments();
        var maxPage = Math.ceil(totalPosts / limitPage);
        await Post
            .find()
            .sort({createdAt: -1})
            .skip((page - 1) * limitPage)
            .limit(limitPage)
            .populate({
                path: 'creator',
                select: 'username fullname'

            })
            .populate({
                path: 'topic'
            })
            .populate({
                path: 'comments',
                populate: {
                    path: 'userComment',
                    model: 'User',
                    select: 'username fullname'
                }
            })
            .then(
                (posts) => {
                    res.json({
                            posts: posts,
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

    async findPost(req, res, next) {
        var page = req.query.page || 1;
        var searchBlogTitle = req.query.searchBlogTitle;

        var limitPage = 6;
        var totalPosts = await Post.find({title: {$regex: '.*' + searchBlogTitle + '.*'}}).countDocuments();
        var maxPage = Math.ceil(totalPosts / limitPage);
        await Post
            .find({title: {$regex: '.*' + searchBlogTitle + '.*'}})
            .sort({createdAt: -1})
            .skip((page - 1) * limitPage)
            .limit(limitPage)
            .populate({
                path: 'creator',
                select: 'username fullname'

            })
            .populate({
                path: 'topic'
            })
            .populate({
                path: 'comments',
                populate: {
                    path: 'userComment',
                    model: 'User',
                    select: 'username fullname'
                }
            })
            .then(
                (posts) => {
                    res.json({
                            posts: posts,
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

    async updateStatusPost(req, res, next) {

        var postId = req.params.postId;
        var status = req.body.status;
        await Post
            .findOne({_id: postId})
            .then(
                (post) => {
                    post.statusPost = status;
                    post.save();
                    res.json({
                            post: post
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


    async getTotalUser(req, res, next) {
        const userCount = await User.countDocuments();
        return res.json({
            totalUser: userCount
        })
    }

    async getAmountBlogMonth(req, res, next) {

        const nowDate = Date.now();
        const month = (new Date(nowDate).getMonth()) + 1;
        const year = new Date(nowDate).getFullYear();

        const totalBlog = await Post.countDocuments({
            $expr: {
                $and: [
                    {$eq: [{$month: '$createdAt'}, month]},
                    {$eq: [{$year: '$createdAt'}, year]},
                ],
            },
        })
        return res.json({
            totalBlogMonth: totalBlog
        })
    }

    async getTotalReport(req, res, next) {

        const reportBlogCount = await ReportBlog.countDocuments({
            $expr: {
                $and: [
                    {$eq: ['$status', "Đang chờ xử lí"]}
                ],
            },
        })

        const reportCommentCount = await ReportComment.countDocuments({
            $expr: {
                $and: [
                    {$eq: ['$status', "Đang chờ xử lí"]}
                ],
            },
        })
        return res.json({
            totalReport: reportBlogCount + reportCommentCount
        })
    }

    //todo thong ke doanh thu tu ban hang



    /// manager user

    async showUser(req, res, next) {
        var page = req.query.page || 1;
        var limitPage = 6;
        var totalUsers = await User.countDocuments();
        var maxPage = Math.ceil(totalUsers / limitPage);
        await User
            .find()
            .sort({createdAt: -1})
            .skip((page - 1) * limitPage)
            .limit(limitPage)
            .then(
                (users) => {
                    res.json({
                            users: users,
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

    async updateStatusUser(req, res, next) {
        var userId = req.body.userId;
        await User
            .findOne({_id: userId})
            .then(
                (user) => {
                    user.status = !user.status;
                    user.save();
                    res.json({
                            user: user
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

    async updateUser(req, res, next) {
        const userId = req.body.userId;
        const username = req.body.username;
        const fullname = req.body.fullname;
        const avatar = req.body.avatar;
        const email = req.body.email;
        const phone = req.body.phone;
        await User.findOne({ "_id": userId })
            .then(async (userDetail) => {
                if (userDetail) {
                    const existEmail = await User.findOne({ "email": email })
                    const existUsername = await User.findOne({ "username": username })
                    const existPhone = await User.findOne({"phone": phone})
                    if (existEmail && existEmail._id.toString() !== userId) {
                        res.status(409).json({ status: "Error", message: "Email was exist" });
                    }
                    else if (existUsername && existUsername.id.toString() !== userId) {
                        res.status(409).json({ status: "Error", message: "Username was exist" });
                    }
                    else if (existPhone && existPhone.id.toString() !== userId) {
                        res.status(409).json({ status: "Error", message: "Phone was exist" });
                    }
                    else {
                        const userProfile = {
                            username: username || userDetail.username,
                            email: email || userDetail.email,
                            password: userDetail.password,
                            admin: userDetail.admin,
                            fullname: fullname || userDetail.fullname,
                            phone: phone || userDetail.phone,
                            avatar: avatar || userDetail.avatar
                        }
                        await User.updateOne(
                            { _id: userId },
                            { $set: userProfile }
                        )
                        res.status(200).json({
                            user: userProfile,
                            status: "Success",
                            message: "Update success"
                        }
                        )
                    }



                } else {
                    res.status(404).json({ status: "Error", message: "USer is not found" });
                }
            })
    }

    async findUser(req, res, next) {
        var page = req.query.page || 1;
        var searchUser = req.query.searchUser;
        console.log("searchUser", searchUser);

        var limitPage = 6;
        var totalUsers = await Post.find({username: {$regex: '.*' + searchUser + '.*'}}).countDocuments();
        var maxPage = Math.ceil(totalUsers / limitPage);
        await User
            .find({username: {$regex: '.*' + searchUser + '.*'}})
            .sort({createdAt: -1})
            .skip((page - 1) * limitPage)
            .limit(limitPage)
            .then(
                (users) => {
                    res.json({
                            users: users,
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

module.exports = new DashboardController();