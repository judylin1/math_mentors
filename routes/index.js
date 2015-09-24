var express = require('express');
var router = express.Router();

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

module.exports = router;
