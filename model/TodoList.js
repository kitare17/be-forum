const mongoose = require('mongoose')
const Schema = mongoose.Schema;



const TodoList = new Schema({
        title: {
            type: String,
        },
        detail: {
            type: String, 
        },
        startDate:{
            type: String,
        },
        endDate:{
            type: String,
        },
        label: {
            type: String,
            enum: ['Công việc', 'Học tập', 'Đời sống'],
            default: 'Công việc'
        },
        status: {
            type: String,
            enum: ['Đã xong', 'Đang làm', 'Bỏ'],
            default: 'Đang làm'
        },
        prioritize: {
            type: String,
            enum: ['Rất quan trọng', 'Quan trong', 'Binh thường'],
            default: 'Binh thường'
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
    },
    {
        timestamps: true
    })

module.exports = mongoose.model("TodoList", TodoList);