var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
exports.signupdata = function(req, res) {
  res.render('signup.ejs', {
    title: 'Signup'
  });
};

exports.sendMail = function(req, res) {
  res.render('signup.ejs', {
    title: 'Signup',
    message: 'Message sent!'
  });
};

module.exports = router;
