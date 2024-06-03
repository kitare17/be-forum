const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskManagement = new Schema({
    task_name: {
        type: String,
    },
    createAt: {
        type: Date,
    },
    updateAt: {
        type: Date,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    todoList: [{
        type: Schema.Types.ObjectId,
        ref: 'TodoList'
    }],
}, {
    timestamps: true 
});

module.exports = mongoose.model("TaskManagement", TaskManagement);
