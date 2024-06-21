const mongoose = require('mongoose')
const Schema = mongoose.Schema;
var slug = require('mongoose-slug-updater');
mongoose.plugin(slug);


const TaskGroup = new Schema({
        title: {
            type: String,
            required: true
        },
        detail: {
            type: String,
            required: true
        },
        assignee: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        status: {
            type: String,
            enum: ["Đã giao", "Đang làm", "Hoàn thành","Hủy"],
            default: "Đã giao"
        },
        group: {
            type: Schema.Types.ObjectId,
            ref: 'Group'
        },
        label: {
            type: String,
            enum: ["Quan trọng", "Trung bình", "Thấp"],
            default:"Thấp",
            required: true
        },

        startDate: {
            type: String,
            required: true
        },
        endDate: {
            type: String,
            required: true
        },

    },
    {
        timestamps: true
    })

module.exports = mongoose.model("TaskGroup", TaskGroup);