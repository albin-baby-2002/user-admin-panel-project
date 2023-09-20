const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const state = {
    contactConnection: null,
}

const makeDbConnection = async () => {

    return new Promise(async (resolve, reject) => {

        const contactsDb = await mongoose.connect
            (process.env.CONNECTION_STRING_DB1,
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                })
            .then((connection) => {
                console.log("connected to database");
                state.contactConnection = connection;
                resolve()
            })

            .catch((err) => {
                console.log("failed to connect to db")
                reject(err);
            })

    })



}

const get = () => {
    return state.contactConnection;
}



module.exports = { makeDbConnection, get } 