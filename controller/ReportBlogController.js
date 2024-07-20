const ReportBlog = require("../model/ReportBlog");
const Post = require("../model/Post");

class ReportBlogController {
    async createReportBlog(req, res, next) {
        const reportBodyData = req.body;
        const newReport = new ReportBlog(reportBodyData);
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

    async showReportBlog(req, res, next) {
        var page = req.query.page || 1;
        var limitPage = 6;
        var totalReportBlog = await ReportBlog.countDocuments();
        var maxPage = Math.ceil(totalReportBlog / limitPage);
        await ReportBlog
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


    async blockBlogChoice(req, res, next) {
        const reportId = req.params.reportId;
        await ReportBlog
            .findOne({"_id": reportId})
            .then(report => {
                const blogId = report.blogId;
                report.status="Đã giải quyết";
                report.save();

                Post.findOneAndUpdate(
                    {"_id": blogId},
                    {statusPost: "Bị khóa"},
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
            })
            .catch(err => {
                console.log(err)
                res.json({
                    err: err
                })
            })
    }

    async cancelBlogChoice(req, res, next) {
        const reportId = req.params.reportId;

        ReportBlog.findOneAndUpdate(
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
        var statusReport =req.query.statusReport;

        var limitPage = 6;
        var totalReportBlog = await ReportBlog.countDocuments();
        var maxPage = Math.ceil(totalReportBlog / limitPage);
        await ReportBlog
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

module.exports = new ReportBlogController();
