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
                        message:"Lỗi tải report vui lòng thử lại",
                        err:err
                    })
                }
            )
    }
}

module.exports = new ReportBlogController();
