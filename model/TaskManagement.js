const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskManagement = new Schema({
    taskName: {
        type: String,
    },
    createAt: {
        type: Date,
        default: null
    },
    updateAt: {
        type: Date,
        default: null
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
