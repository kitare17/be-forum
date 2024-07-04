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

}

module.exports = new DashboardController();