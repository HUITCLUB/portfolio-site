var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'huitclub';

const find = function(db, cond, cb) {
  const collection = db.collection('portfolio');
  collection.find(cond).toArray(function(err, data) {
    assert.equal(null, err);
    cb(data);
  });
};

// markdown renderer
const md = require('markdown-it')();

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
});

router.get('/:path', function(req, res, next) {
  MongoClient.connect(url, (err, client) => {
    assert.equal(null, err);
    const db = client.db(dbName);

    find(db, {'path': '/' + req.params.path}, function(data) {
      assert.equal(1, data.length);
      data = data[0];
      delete data._id;
      data.page = md.render(data.page);

      res.render('port-page', { title: 'portfolio-ken', data: data});
      client.close();
    });
  });
});

module.exports = router;
