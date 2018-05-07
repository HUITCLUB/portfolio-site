var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('portfolio', { title: 'HUIT-portfolio' });
});


// TODO: make user list to save portfolio each
router.get('/users', function(req, res, next) {
  res.render('userlist', { title: 'HUIT-portfolio' });
});

module.exports = router;
