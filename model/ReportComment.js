const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const ReportComment = new Schema({
        title: {
            type: String,
            required: true
        },
        reason: {
            type: String,
            required: true
        },
        userReport: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        blogId: {
            type: Schema.Types.ObjectId,
            ref: 'Post',
            required: true
        },
        commentId: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['Đang chờ xử lí', 'Đã giải quyết', "Báo cáo không hợp lệ"],
            default: 'Đang chờ xử lí'
        }
    },
    {
        timestamps: true
    })

module.exports = mongoose.model("ReportComment", ReportComment);