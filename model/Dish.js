var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const dish = new Schema({
    name: {type: String},
    image: {type: String},
    category: {type: String},
    label: {type: String},
    price: {type: Number},
    featured: {type: Boolean, default: true},
    description: {type: String},
    comments: {type: Array}
})

module.exports = mongoose.model("Dish",dish);