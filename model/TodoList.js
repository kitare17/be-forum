const mongoose = require('mongoose')
const Schema = mongoose.Schema;



const TodoList = new Schema({
    title: {
        type: String,
    },
    detail: {
        type: String,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    label: {
        type: String,
        enum: ['Công việc', 'Học tập', 'Đời sống'],
        default: 'Công việc'
    },
    status: {
        type: String,
        enum: ['Nhiệm vụ', 'Đang làm', 'Đã xong', 'Hủy'],
        default: 'Nhiệm vụ'
    },
    prioritize: {
        type: String,
        enum: ['Rất quan trọng', 'Quan trọng', 'Bình thường'],
        default: 'Binh thường'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    taskManagement: {
        type: Schema.Types.ObjectId,
        ref: 'TaskManagement'
    },
},
    {
        timestamps: true
    })

module.exports = mongoose.model("TodoList", TodoList);