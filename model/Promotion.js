const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const promotion = new Schema({
    name: {type: String},
    image: {type: String},
    label: {type: String},
    price: {type: Number},
    featured: {type: Boolean, default: true},
    description: {type: String}
})
module.exports = mongoose.model("Promotion",promotion);