const mongoose = require('mongoose')
const Schema = mongoose.Schema;
var slug = require('mongoose-slug-updater');
mongoose.plugin(slug);


const Group = new Schema({
        groupName: {
            type: String,
            required: true
        },
        groupDescription: {
            type: String
        },
        status: {
            type: String,
            enum: ["Bị khóa", "Hoạt động"],
            default: "Hoạt động"
        },
        members: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        adminGroup: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        slug: {
            type: String,
            slug: 'groupName',
            unique: true
        }
    },
    {
        timestamps: true
    })

module.exports = mongoose.model("Group", Group);