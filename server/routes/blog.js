var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const fs = require('fs');
const async = require("async");

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

function drawMainPage(req, res, next, condition) {
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
      find(db, condition, function(data) {
        // close connection cuz we've done with database
        client.close();

        if (data != null)
        {
          data.map(x => delete x._id); // remove unneeded fields inside data

          var result = [];
          // cannot use data.forEach cuz I have to check the i th data is last one or not for callback in waterfall
          for (var i = 0; i < data.length; i++) {
            fs.readFile(md_path, function(err, data) {
              if (err) throw err;
              delete data[i].path; // remove path info for security
              data[i].page = md.render(data);

              // each data includes category, date, title, author, page
              result.push(data[i]);

              if(i === data.length - 1) {
                cb(null, result);
              }
            });
          }
        } else {
          cb(null, null);
        }
      });
    }],
    function (err, result) {
      // result is the list of posts
      res.render('blog', { title: 'HUIT-blog', post: {val: result} });
    });
}

/* GET home page. */
router.get('/', function(req, res, next) {
  drawMainPage(req, res, next, {});
});

router.get('/:category', function(req, res, next) {
  drawMainPage(req, res, next, {'category': category});
});

router.get('/:category/:date/:subtitle', function(req, res, next) {
  MongoClient.connect(url, (err, client) => {
    if (err) throw err;

    const category = req.params.category;
    const date = req.params.date;
    const subtitle = req.params.subtitle;

    const db = client.db(dbName);

    find(db, {
      'date': date,
      'category': category,
      'subtitle': subtitle}, function(err, data) {
      data = data[0];
      delete data._id;

      if (data == null) {
        var err = new Error('Not Found');
        err.status = 404;
        throw err;
      }

      fs.readFile(data.path, 'utf-8', function(err, text) {
        if (err) throw err;
        delete data.path; // remove path info for security

        // remove meta data
        tmp = text.split('---');
        textWithoutMetadata = tmp[2];

        data.page = md.render(textWithoutMetadata);
        res.render('blog-page', { title: 'HUIT-blog', data: data });
        client.close();
      });
    });
  });
});

module.exports = router;
