const mongoose = require("mongoose");
const Schemal = mongoose.Schema;
const jwt = require("jsonwebtoken");

const User = new Schemal({
    username: {
        type: String,
        required: [true, "require username"],
        unique: true
    },
    password: {
        type: String,
        select: false,
        required: [true, "require password"]
    },
    fullname: {
        type: String,
        required: [true, "require fullname"]
    },
    email: {
        type: String,
        required: [true, "require email"],
        unique: true

    },
    phone: {
        type: String,
        required: [true, "require phone"],
        unique: true
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