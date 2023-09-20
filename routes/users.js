var express = require('express');
var router = express.Router();
const Product = require('../models/productModel')

const {

  loginPageRender,
  signupPageRender,
  signupHandler,
  loginHandler

} = require('../controllers/userControllers')


router.route('/home')
  .get(async (req, res, next) => {

    if (!req.session.loggedIn) {

      res.redirect('/');

    }

    const user = req.session.user;

    console.log(user);

    const products = await Product.find({}).lean();

    res.render('users/index', { products, user })
  })

router.route('/')
  .get(loginPageRender)

router.route('/login')
  .post(loginHandler)


router.route('/signup')
  .get(signupPageRender)
  .post(signupHandler)

router.route('/logout')
  .get((req, res, next) => {
    req.session.destroy();
    res.redirect('/')
  })



router.get('/')

module.exports = router;
