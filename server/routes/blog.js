var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'huitclub';

const find = function(db, cond, cb) {
  const collection = db.collection('blog');
  collection.find(cond).toArray(function(err, data) {
    assert.equal(null, err);
    cb(data);
  });
};

/* GET home page. */
router.get('/', function(req, res, next) {
  MongoClient.connect(url, (err, client) => {
    assert.equal(null, err);
    const db = client.db(dbName);

    find(db, {}, function(data) {
      data.map(x => delete x._id);
      data.map(x => delete x.page);
      for (var i = 0; i < data.length; i++) {
        data[i].path = "/portfolio".concat(data[i].path);
      }

      res.render('portfolio', { title: 'HUIT-portfolio', data: {val: data} });
      client.close();
    });
  });

  res.render('blog', { title: 'HUIT-blog' });
});

module.exports = router;
