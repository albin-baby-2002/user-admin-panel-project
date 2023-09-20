const express = require('express');
const User = require('../models/userModel')
const bcrypt = require('bcrypt')


//render handler

const loginPageRender = (req, res, next) => {

    if (req.session.loggedIn) {

        res.redirect('/home');

    }

    res.render('users/login', { admin: false, authenticated: true });

}


const signupPageRender = (req, res, next) => {

    res.render('users/signup', { admin: false, });

}

//functions handler


const signupHandler = async (req, res, next) => {

    console.log(req.body)

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.render('users/signup', { admin: false, invalidForm: true });

    }

    const existingUser = await User.findOne({ email });



    if (existingUser) {

        console.log(existingUser)

        return res.render('users/signup', { admin: false, invalidForm: true, existingUser: true });

    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        username,
        email,
        password: hashedPassword
    })

    if (newUser) {

        return res.redirect('/')
    } else {
        res.status(400);
        throw new Error("data not valid")
    }



}

const loginHandler = async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) {

        return res.render('users/login', { admin: false, authenticated: false });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser && (await bcrypt.compare(password, existingUser.password))) {

        req.session.loggedIn = true;
        req.session.user = { name: existingUser.username, _id: existingUser.id };
        console.log(req.session.user)

        res.status(200);

        res.redirect('/home')
        return;
    } else {
        return res.render('users/login', { admin: false, authenticated: false });
    }
}






module.exports = {
    loginPageRender,
    signupPageRender,
    signupHandler,
    loginHandler
}