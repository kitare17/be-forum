const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const User = require('./User')
const Category = require('./Category')

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


const SalePost = new Schema({
        title: {
            type: String,
            required: true
        },
        detail: {
            type: String,
            required: true
        },
        images: {
            type: [String],
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        productStatus: { //tinh trang (đã qua sử dụng hay new, độ mới bao nhiu %)
            type: String,
            required: true
        },
        category: { 
            type: Schema.Types.ObjectId, 
            ref: 'Category', 
            required: true 
        },
        brand: { //thương hiệu
            type: String,
            required: true
        },
        origin: { //xuất sứ
            type: String,
            required: true
        },
        address: { //khu vực (dạng kiểu địa chỉ tương đối hoặc địa chỉ tuyệt đối )
            type: String,
            required: true
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        isLock: { //Khóa hoặc mở bài đăng (ẩn hoặc hiện)
            type: Boolean,
            default: false
        },
        isSold: { //thể hiện đã bán hay chưa 
            type: Boolean,
            default: false
        },
        comments: [Comment]
    },
    {
        timestamps: true
    })

module.exports = mongoose.model("SalePost",SalePost );