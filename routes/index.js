var express = require('express');
var router = express.Router();
var stormpath = require('express-stormpath');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Math Mentors' });
});

router.get('/about', function(req, res, next) {
  res.render('about')
});

router.get('/faq', function(req, res, next) {
  res.render('faq')
});

router.get('/fees', function(req, res, next) {
  res.render('fees')
});

router.get('/subjects', function(req, res, next) {
  res.render('subjects')
});

router.get('/question/new', function(req, res, next) {
  res.render('questions/new')
});

router.get('/dashboard', stormpath.loginRequired, function(req, res) {
  res.send('Welcome back: ' + res.locals.user.email);
});

module.exports = router;
