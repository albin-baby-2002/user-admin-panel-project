var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('express-hbs');
const session = require('express-session')






// local file imports

var users = require('./routes/users');
var admin = require('./routes/admin');
const { makeDbConnection, get } = require('./config/dbConnection')

//connecting to database





// invoking express application

var app = express();


// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.engine('hbs', hbs.express4({ extname: '.hbs', layoutsDir: __dirname + "/views/layout/", defaultLayout: 'views/layout/layout', partialsDir: __dirname + '/views/partials/' }))


// middlewares

app.use(logger('dev'));
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'key', resave: true,
  saveUninitialized: true, cookie: { maxAge: 5000000 }
}))

app.use('/', users);
app.use('/admin', admin)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


//removed codes  1.favicon