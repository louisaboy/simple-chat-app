const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

const chatSchema = require("./Chat");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    picture: {
        type: String,
        require: true
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;