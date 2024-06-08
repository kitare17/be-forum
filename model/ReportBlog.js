const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const ReportBlog = new Schema({
        title: {
            type: String,
            required: true
        },
        reason: {
            type: String,
            required: true
        },
        userReport:{
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        blogId : {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        },
        status:{
            type:String,
            enum: ['Đang chờ xử lí', 'Đang giải quyết',"Không hợp lệ"],
            default: 'Đang chờ xử lí'
        }
    },
    {
        timestamps: true
    })

module.exports = mongoose.model("ReportBlog", ReportBlog);