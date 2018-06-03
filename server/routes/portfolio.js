var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://127.0.0.1:27017';
const dbname = 'huitclub';

const findPortfolioes = function(db, cb) {
  const collection = db.collection('portfolioes');
  collection.find({}).toArray(function err, ports {
    assert.equal(null, err);
    cb(ports);
  });
}

MongoClient.connect(url, (err, client) => {
  assert.equal(null, err);

  const db = client.db(dbName);

  client.close();
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('portfolio', { title: 'HUIT-portfolio' });
});

router.get('/ken', function(req, res, next) {
  res.render('port-page', { title: 'portfolio-ken' });
});

module.exports = router;
