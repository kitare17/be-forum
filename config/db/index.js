const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/sdn301m');
        console.log("Connect mongodb successful")
    } catch (error) {
        console.log(error)
    }

}

module.exports = {connect};