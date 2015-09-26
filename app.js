var express = require('express');
require('dotenv').load();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var stormpath = require('express-stormpath');

//server
var mongo = require('mongodb');
var ObjectID = mongo.ObjectID;
var monk = require('monk');
var db = monk('localhost:27017/math');

var routes = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
var questions = require('./routes/questions');
var categories = require('./routes/categories');

var app = express();

app.use(stormpath.init(app, {
  postLoginHandler: function (account, req, res, next) {
    console.log('Hey! ' + account.email + ' just logged in!');
    next();
  },
  postRegistrationHandler: function (account, req, res, next) {
    var collection = db.get('usercollection');
    var mongo_id = new ObjectID();
    collection.insert( { _id: mongo_id, questions: [] } );
    account.customData["mongo_id"] = mongo_id;
    console.log('User:', account.email, 'just registered!');
    account.customData.save(function(err) {
     if (err) {
         console.log('DID NOT SAVE USER');
         next(err);
     } else {
         console.log('custom data saved!');
     }
   });
    next();
  },
  apiKeyId: process.env.STORMPATH_ID,
  apiKeySecret: process.env.STORMPATH_SECRET,
  application: process.env.STORMPATH_APP,
  secretKey: process.env.SECRET,
  redirectUrl: '/dashboard',
  enableForgotPassword: true,
  expandCustomData: true,
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//db to router
app.use(function(req,res,next){
  req.db = db;
  next();
});

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
