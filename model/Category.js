const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const User = require('./User')
var slug = require('mongoose-slug-generator');
mongoose.plugin(slug);


const Category = new Schema({
        name: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        slug : {
            type : String,
            slug: 'name'
        }
    },
    {
        timestamps: true
    })

module.exports = mongoose.model("Category", Category);