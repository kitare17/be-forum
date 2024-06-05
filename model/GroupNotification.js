const mongoose = require('mongoose')
const Schema = mongoose.Schema;
var slug = require('mongoose-slug-updater');
const mongoose = require("mongoose");
mongoose.plugin(slug);


const GroupNotificaton = new Schema({
        title: {
            type: String,
            required: true
        },
        detail: {
            type: String,
            required: true
        },
        group: {
            type: Schema.Types.ObjectId,
            ref: 'Group'
        },
        slug: {
            type: String,
            slug: 'title',
            unique:true

        }
    },
    {
        timestamps: true
    })

module.exports = mongoose.model("GroupNotificaton", GroupNotificaton);