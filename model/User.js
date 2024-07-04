const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");

const User = new Schema({
    username: {
        type: String,
        required: [true, "require username"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "require email"],
        unique: true,

    },
    password: {
        type: String,
        required: [true, "require password"]
    },
    fullname: {
        type: String,
        // required: [true, "require fullname"]
    },
    avatar: {
        type: String,
    },
    
    phone: {
        type: String,
        // required: [true, "require phone"],
        unique: true,
        sparse: true
    },
    admin: {
        type: Boolean,
        default: false
    }
})
User.methods.signJWT = function () {
    console.log(this);
    return jwt.sign({
            username: this.username,
            fullname: this.fullname
        },
        "kitarenfaklhek",
        {
            expiresIn: 60
        }
    )
}


module.exports = mongoose.model("User", User);