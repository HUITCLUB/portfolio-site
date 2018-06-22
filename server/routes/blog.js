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

        var result;
        fs.readFile(__dirname + '\\..\\..\\data\\2018-02-27-Seq2Seq.md', 'utf-8', function(err, text) {
          assert(err, null);
          console.log(__filename);
          console.log(__dirname + '\\..\\..\\data\\2018-02-27-Seq2Seq.md');
          console.log(text);
          page = md.render(text);
          var val;
          val.page = page;

          // each data includes category, date, title, author, page
          result.push(val);
          cb(null, result);
        });
        // if (data != null)
        // {
        //   data.map(x => delete x._id); // remove unneeded fields inside data

        //   var result;
        //   // cannot use data.forEach cuz I have to check the i th data is last one or not for callback in waterfall
        //   for (var i = 0; i < data.length; i++) {
        //     fs.readFile(md_path, function(err, data) {
        //       assert(err, null);
        //       delete data[i].path; // remove path info for security
        //       data[i].page = md.render(data);

        //       if(i === data.length - 1) {
        //         cb(null, result);
        //       }
        //       // each data includes category, date, title, author, page
        //       result.push(data[i]);
        //     });
        //   }
        // } else {
        //   cb(null, null);
        // }
      });
    }],
    function (err, result) {
      // result is the list of posts
      res.render('blog', { title: 'HUIT-blog', post: {val: result} });
      // result now equals 'done'
    });
});

// router.get('/:category/:date/:title', function(req, res, next) {
//   MongoClient.connect(url, (err, client) => {
//     // TODO: need to change assert statement into error handling function in general
//     assert.equal(null, err);
//
//     const category = req.params.category;
//     const date = req.params.date;
//     const title = req.params.title;
//
//     const db = client.db(dbName);
//
//     find(db, {
//       'date': date,
//       'category': category,
//       'title': title,}, function(data) {
//       data.map(x => delete x._id);
//       data.map(x => delete x.page);
//
//       res.render('blog-page', { title: 'HUIT-portfolio', data: {val: data} });
//       client.close();
//     });
//   });
// });

module.exports = router;
