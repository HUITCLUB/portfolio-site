var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var async = require("async");

let kt = require('katex'),
    tm = require('markdown-it-texmath').use(kt),
    md = require('markdown-it')().use(tm,{delimiters:'brackets'});

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'huitclub';

const find = function(db, cond, cb) {
  const collection = db.collection('blog');
  collection.find(cond).toArray(function(err, data) {
    assert.equal(null, err);
    cb(null, data);
  });
};

/* GET home page. */
router.get('/', function(req, res, next) {
  async.waterfall(
    [
    function(cb) {
      MongoClient.connect(url, (err, client) => {
        assert.equal(null, err);
        const db = client.db(dbName);
        cb(null, db, client);
      });
    },
    function(db, client, cb) {
      find(db, {}, function(data) {
        // close connection cuz we've done with database
        client.close();
        // remove unneeded fields inside data
        if (data != null)
        {
          data.map(x => delete x._id);
          data.map(x => delete x.page);
          for (var i = 0; i < data.length; i++) {
            data[i].category;
            data[i].date;
            data[i].title;
            data[i].author;
          }
        }
        
        var result = null;
        cb(null, result);
      });
    }],
    function (err, result) {
      res.render('blog', { title: 'HUIT-blog' });
      // result now equals 'done'
    });
});

router.get('/:category/:date/:title', function(req, res, next) {
  MongoClient.connect(url, (err, client) => {
    // TODO: need to change assert statement into error handling function in general
    assert.equal(null, err);

    const category = req.params.category;
    const date = req.params.date;
    const title = req.params.title;

    const db = client.db(dbName);

    find(db, {
      'date': date,
      'category': category,
      'title': title,}, function(data) {
      data.map(x => delete x._id);
      data.map(x => delete x.page);

      res.render('blog-page', { title: 'HUIT-portfolio', data: {val: data} });
      client.close();
    });
  });
});

module.exports = router;
