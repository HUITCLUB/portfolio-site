var express = require('express');
var router = express.Router();
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const assert = require('assert');

MongoClient.connect('mongodb://127.0.0.1:27017/portfolioes', (err, db) => {

});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('portfolio', { title: 'HUIT-portfolio' });
});

router.get('/ken', function(req, res, next) {
  res.render('port-page', { title: 'portfolio-ken' });
});

module.exports = router;
