const mongoose = require('mongoose')
const Schema = mongoose.Schema;
var slug = require('mongoose-slug-updater');
mongoose.plugin(slug);


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
        },
        slug : {
            type : String,
            slug: 'title',
            unique:true
        }
    },
    {
        timestamps: true
    })

module.exports = mongoose.model("Topic", Topic);