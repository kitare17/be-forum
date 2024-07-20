const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");

const User = new Schema({
    username: {
        type: String,
        required: [true, "require username"],
    },
    email: {
        type: String,
        required: [true, "require email"],

    },
    password: {
        type: String,
        required: [true, "require password"]
    },
    fullname: {
        type: String,
    },
    avatar: {
        type: String,
    },
    
    phone: {
        type: String    
    },
    admin: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
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