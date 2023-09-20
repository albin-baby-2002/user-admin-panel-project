var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');

const { log } = require('handlebars');
const User = require('../models/userModel');



const {
    loginPageRender,
    loginHandler,
    userDataRenderer,
    userUpdatePageRenderer,
    logoutHandler,
    userUpdateHandler,
    userDeleteHandler,
    addUserPageRender,
    addUserHandler,
    userSearchHandler } = require('../controllers/adminControllers')




router.get('/', loginPageRender);

router.post('/login', loginHandler);

router.get('/home', userDataRenderer);

router.get('/logout', logoutHandler);

router.get('/delete/:id', userDeleteHandler);

router.post('/search', userSearchHandler)

router.route('/update/:id')
    .get(userUpdatePageRenderer)
    .post(userUpdateHandler);



router.route('/adduser')
    .get(addUserPageRender)
    .post(addUserHandler);



module.exports = router;
