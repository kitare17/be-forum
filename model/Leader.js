const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leader = new Schema({
    name: {type: String},
    image: {type: String},
    designation: {type: String},
    abbr: {type: String},
    featured: {type: Boolean, default: true},
    description: {type: String}
})

module.exports = mongoose.model("Leader", leader);