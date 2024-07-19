const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const User = require('./User')
const SalePost =require('./SalePost')
const Wishlist = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
            ref: 'User'
    },
    postLiked: [{
        type: Schema.Types.ObjectId,
            ref: 'SalePost'
    }]
},
{
    timestamps: true
})

module.exports = mongoose.model("Wishlist",Wishlist );