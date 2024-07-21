const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/fu-forum");
    console.log("Connect mongodb successful");
  } catch (error) {
    console.log(error);
  }
}

module.exports = { connect };
