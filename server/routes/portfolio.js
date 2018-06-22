var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const md = require('markdown-it');

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'huitclub';

const find = function(db, cond, cb) {
  const collection = db.collection('portfolio');
  collection.find(cond).toArray(function(err, data) {
    assert.equal(null, err);
    cb(null, data);
  });
};

/* GET home page. */
router.get('/', function(req, res, next) {
  MongoClient.connect(url, (err, client) => {
    // TODO: need to change assert statement into error handling function in general
    assert.equal(null, err);
    const db = client.db(dbName);

    find(db, {}, function(err, data) {
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

    find(db, {'path': '/' + req.params.path}, function(err, data) {
      // TODO: need to change assert statement into error handling function in general
      assert.equal(1, data.length);
      data = data[0];
      delete data._id;
      data.page = md.render(data.page);

      res.render('port-page', { title: 'portfolio' + req.params.path, data: data});
      client.close();
    });
  });
});

module.exports = router;
