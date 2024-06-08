const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const User = require('./User')

const Comment = new Schema({
        _id: {
            type: Schema.Types.ObjectId,
            default: () => new mongoose.Types.ObjectId()
        },
        detail: {
            type: String,
            required: true
        },
        userComment: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true
    })


const Post = new Schema({
        title: {
            type: String,
            required: true
        },
        detail: {
            type: String,
            required: true
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        statusPost: {
            type: String,
            enum: ['Đang hoạt động', 'Bị khóa'],
            default: 'Đang hoạt động'
        },
        comments: [Comment],
        likes:[
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        timestamps: true
    })

module.exports = mongoose.model("Post", Post);