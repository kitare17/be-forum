const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const DocShare = new Schema({
        docName: {
            type: String,
            required: true
        },
        group: {
            type: Schema.Types.ObjectId,
            ref: 'Group'
        },

        link: {
            type: String,
        }
    },
    {
        timestamps: true
    })

module.exports = mongoose.model("DocShare", DocShare);