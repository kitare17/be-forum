const User = require("../model/User");
const Post = require("../model/Post");
const ReportBlog = require("../model/ReportBlog");
const ReportComment = require("../model/ReportComment");

class DashboardController {

    async getTotalUser(req, res, next) {
       const userCount=await User.countDocuments();
       return res.json({
           totalUser:userCount
       })
    }

    async getAmountBlogMonth(req, res, next) {

        const nowDate=Date.now();
        const month=(new Date(nowDate).getMonth())+1;
        const year =new Date(nowDate).getFullYear();

        const totalBlog=await Post.countDocuments({
            $expr: {
                $and: [
                    { $eq: [{ $month: '$createdAt' }, month] },
                    { $eq: [{ $year: '$createdAt' },year] },
                ],
            },
        })
        return res.json({
            totalBlogMonth:totalBlog
        })
    }
    async getTotalReport(req, res, next) {

        const reportBlogCount= await ReportBlog.countDocuments({
            $expr: {
                $and: [
                    { $eq: [ '$status' , "Đang chờ xử lí"] }
                ],
            },
        })

        const reportCommentCount= await ReportComment.countDocuments({
            $expr: {
                $and: [
                    { $eq: [ '$status' , "Đang chờ xử lí"] }
                ],
            },
        })
        return res.json({
            totalReport:reportBlogCount+reportCommentCount
        })
    }

    //todo thong ke doanh thu tu ban hang

}

module.exports = new DashboardController();