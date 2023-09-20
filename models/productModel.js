const mongoose = require('mongoose')
const { makeDbConnection, get } = require("../config/dbConnection")


const contactDb = get();



const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, " fill the product name field"]
    },
    category: {
        type: String,
        required: [true, " fill the product category field"],

    },
    description: {
        type: String,
        required: [true, " fill the product description field"],
    },
    price: {
        type: String,
        required: [true, " fill the product price field"],
    }
}, {
    timestamps: true
}

)

module.exports = contactDb.model('Product', productSchema)