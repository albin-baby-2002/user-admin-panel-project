const Admin_key = "$2b$10$bI9Pc7SOHhCDoqyhDrpG7e5LVE4yVrw9i1smH2V3lJsTn59o8lKwK";

var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const { log } = require('handlebars');
const User = require('../models/userModel')




const loginPageRender = (req, res, next) => {


    if (req.session.loggedIn && req.session.isAdmin) {
        return res.redirect("/admin/home")
    }

    res.render('admin/login', { admin: true, authenticated: true, loggedOut: true });

};


const loginHandler = async (req, res, next) => {



    const { email, password } = req.body;

    if (!email || !password) {
        return res.render('admin/login', { admin: true, authenticated: false, loggedOut: true })
    }




    if (email === process.env.ADMIN_EMAIL && (await bcrypt.compare(password, Admin_key))) {

        req.session.isAdmin = true;
        req.session.loggedIn = true;

        res.redirect('/admin/home')
    } else {
        res.render('admin/login', { admin: true, authenticated: false, loggedOut: true })
    }


};

const userDataRenderer = async (req, res, next) => {

    const Users = await User.find({}).lean();



    if (req.session.loggedIn && req.session.isAdmin) {
        res.render('admin/index', { admin: true, Users });
    } else {
        res.redirect('/admin')
    }



};


const userUpdatePageRenderer = async (req, res, next) => {

    if (!req.session.loggedIn || !req.session.isAdmin) {
        res.redirect('/admin');
        return;
    }

    const id = req.params.id;

    const user = await User.findOne({ _id: id }).lean();

    res.render('admin/updateUser', { user, admin: true })


}

const logoutHandler = (req, res, next) => {
    req.session.destroy();
    res.redirect('/admin')

}

const userUpdateHandler = async (req, res, next) => {

    if (!req.session.loggedIn || !req.session.isAdmin) {
        res.redirect('/admin');
        return;
    }

    const { userId, username, email } = req.body;

    const user = await User.findOne({ _id: userId }).lean();


    if (!userId || !username || !email) {

        const message = "Empty Fields Are Not Allowed"

        return res.render('admin/updateUser', { admin: true, user, message, color: "danger" })
    }

    const isExistingUser = await User.findOne({ _id: userId })

    if (isExistingUser) {


        const update = { $set: { username: username, email: email } };

        await User.findByIdAndUpdate(userId, update, { new: true })
            .then(async () => {



                const message = "Update successful"

                res.render('admin/updateUser', { admin: true, user, message, color: "success" })
            })

            .catch((err) => {

                res.render('admin/updateUser', { admin: true, user, message: err, color: "success" })
            })

    }
};

const userDeleteHandler = async (req, res, next) => {

    if (!req.session.loggedIn || !req.session.isAdmin) {
        res.redirect('/admin');
        return;
    }

    const Users = await User.find({}).lean();


    const userId = req.params.id;

    const conditions = { _id: userId };

    const user = await User.findOne({ _id: userId })

    if (!user) {
        return res.render('admin/index', { Users, admin: true })

    }

    const userName = user.username;

    await User.findOneAndDelete(conditions).then(() => {


        res.render('admin/index', { admin: true, Users, message: `${userName} is Deleted`, color: "success" })
    })


}

const addUserPageRender = (req, res, next) => {

    if (!req.session.loggedIn || !req.session.isAdmin) {
        res.redirect('/admin');
        return;
    }

    res.render('admin/addUser', { admin: true })

}

const addUserHandler = async (req, res, next) => {
    if (!req.session.loggedIn || !req.session.isAdmin) {
        res.redirect('/admin');
        return;
    }



    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.render('admin/adduser', { admin: true, message: "All fields are Mandatory", color: "danger" });

    }

    const existingUser = await User.findOne({ email });



    if (existingUser) {

        console.log(existingUser)

        return res.render('users/signup', { admin: true, message: "This Email is Already in Use", color: "danger" });

    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        username,
        email,
        password: hashedPassword
    })

    if (newUser) {

        return res.render('admin/adduser', { admin: true, message: `${newUser.username} added to Users`, color: "success" });
    } else {
        res.status(400);
        throw new Error("data not valid")
    }

}

const userSearchHandler = async (req, res, next) => {

    if (!req.session.loggedIn || !req.session.isAdmin) {
        res.redirect('/admin');
        return;
    }

    const search = req.body.search;

    if (!search) {

        res.redirect('/admin/home');
        return;

    }

    const Users = await User.find({ username: { $regex: `^${search}`, $options: 'i' } }).lean();

    if (Users) {

        res.render('admin/index', { admin: true, Users });

    } else {

        res.redirect('/admin/home');
        return;
    }

}



module.exports = {

    loginPageRender,
    loginHandler,
    userDataRenderer,
    userUpdatePageRenderer,
    logoutHandler,
    userUpdateHandler,
    userDeleteHandler,
    addUserPageRender,
    addUserHandler,
    userSearchHandler
}