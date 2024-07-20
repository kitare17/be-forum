const ReportComment = require("../model/ReportComment");
const Post = require("../model/Post");
const ReportBlog = require("../model/ReportBlog");

class ReportCommentController {
    async createReportComment(req, res, next) {
        const reportBodyData = req.body;
        const newReport = new ReportComment(reportBodyData);
        await newReport.save()
            .then(
                (report) => {
                    res.json(report);
                }
            )
            .catch(
                (err) => {
                    res.status(500)
                        .json(
                            {
                                message: "Tạo thất bại vui lòng thử lại sau",
                                err: err
                            }
                        )
                }
            )
    }

    async showReportComment(req, res, next) {
        var page = req.query.page || 1;
        var limitPage = 6;
        var totalReportBlog = await ReportComment.countDocuments();
        var maxPage = Math.ceil(totalReportBlog / limitPage);
        await ReportComment
            .find()
            .sort({createdAt: -1})
            .skip((page - 1) * limitPage)
            .limit(limitPage)
            .populate({
                path: 'userReport',
                select: 'username fullname'
            })
            .populate({
                path: 'blogId'
            })
            .then(
                (reports) => {
                    res.json({
                            reports: reports,
                            maxPage: maxPage
                        }
                    )
                }
            )
            .catch(
                (err) => {
                    res.status(500).json({
                        message: "Lỗi tải report vui lòng thử lại",
                        err: err
                    })
                }
            )
    }

    async showReportCommentByStatus(req, res, next) {
        var page = req.query.page || 1;
        var limitPage = 6;
        var totalReportBlog = await ReportComment.countDocuments();
        var maxPage = Math.ceil(totalReportBlog / limitPage);
        var status = req.query.statusReportComment;

        await ReportComment
            .find({status: status})
            .sort({createdAt: -1})
            .skip((page - 1) * limitPage)
            .limit(limitPage)
            .populate({
                path: 'userReport',
                select: 'username fullname'
            })
            .populate({
                path: 'blogId'
            })
            .then(
                (reports) => {
                    res.json({
                            reports: reports,
                            maxPage: maxPage
                        }
                    )
                }
            )
            .catch(
                (err) => {
                    res.status(500).json({
                        message: "Lỗi tải report vui lòng thử lại",
                        err: err
                    })
                }
            )
    }


    async deleteCommentChoice(req, res, next) {
        const reportId = req.params.reportId;
        const commentId = req.body.commentId;
        const postId = req.body.postId;


        await Post.findOne({"_id": postId})
            .then((post) => {
                if (post) {
                    // console.log(JSON.stringify(commentId)===(JSON.stringify(post.comments[0]._id)))
                    var index = post.comments.findIndex(
                        comment => JSON.stringify(commentId) === JSON.stringify(comment._id))
                    console.log("index", index)

                    if (index >= 0) {
                        post.comments.splice(index, 1);
                        post.save()
                            .then(updatePost => {
                                updatePost.populate({
                                    path: 'comments.replyComment',
                                    populate: {
                                        path: 'userComment',
                                        model: 'User',
                                        select: 'username fullname',
                                    }
                                }).then((resData) => {
                                    console.log(resData)
                                })
                            })
                            .catch(err => {
                                return res.json({
                                    err: err
                                })
                            })

                    }
                } else {
                    return res.status(500).json({
                        message: "Not found post"
                    })
                }

            })
            .catch(err => {
                return res.status(500).json({
                    err: err,
                    message: "Error when find post"
                })
            })

        await ReportComment
            .findOne({"_id": reportId})
            .then(report => {

                report.status = "Đã giải quyết";
                report.save();
                res.json({
                    message: "Đã giải quyết thành công"
                })
            })
            .catch(err => {
                console.log(err)
                res.json({
                    err: err
                })
            })
    }

    async cancelChoice(req, res, next) {
        const reportId = req.params.reportId;

        ReportComment.findOneAndUpdate(
            {"_id": reportId},
            {status: "Báo cáo không hợp lệ"},
            {
                useFindAndModify: false,
                new: true
            },
            (err, document) => {
                if (err) return err;
                //console.log(document);
                res.json({
                    message: "Cập nhật thành công",
                })
            }
        )
    }

    async showReportFollowStatusBlog(req, res, next) {
        var page = req.query.page || 1;
        var statusReport = req.query.statusReport;

        var limitPage = 6;
        var totalReportBlog = await ReportComment.countDocuments();
        var maxPage = Math.ceil(totalReportBlog / limitPage);
        await ReportComment
            .find({status: statusReport})
            .sort({createdAt: -1})
            .skip((page - 1) * limitPage)
            .limit(limitPage)
            .populate({
                path: 'userReport',
                select: 'username fullname'
            })
            .populate({
                path: 'blogId'
            })
            .then(
                (reports) => {
                    res.json({
                            reports: reports,
                            maxPage: maxPage
                        }
                    )
                }
            )
            .catch(
                (err) => {
                    res.status(500).json({
                        message: "Lỗi tải report vui lòng thử lại",
                        err: err
                    })
                }
            )
    }
}


module.exports = new ReportCommentController();
