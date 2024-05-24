const ReportComment = require("../model/ReportComment");
const Post = require("../model/Post");

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
                        message:"Lỗi tải report vui lòng thử lại",
                        err:err
                    })
                }
            )
    }
}

module.exports = new ReportCommentController();
