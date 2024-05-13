const mongoose = require('mongoose')
const Schema = mongoose.Schema;



const Topic = new Schema({
        title: {
            type: String,
            required: true
        },
        detail: {
            type: String,
            required: true
        },
        imgUrl:{
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    })

module.exports = mongoose.model("Topic", Topic);