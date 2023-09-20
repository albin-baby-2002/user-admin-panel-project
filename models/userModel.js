const mongoose = require('mongoose')
const { makeDbConnection, get } = require("../config/dbConnection")


const contactDb = get();



const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, " fill the username field"]
    },
    email: {
        type: String,
        required: [true, " fill the email field"],
        unique: [true, " email is already registered"]
    },
    password: {
        type: String,
        required: [true, " fill the password field"],
    }
}, {
    timestamps: true
}

)

module.exports = contactDb.model('User', userSchema)