const express = require('express');
const router = express.Router();

const GitHubStrategy = require('passport-github2').Strategy;
const passport = require('passport');
const key = require("../credentials")

passport.use(new GitHubStrategy({
    clientID: key.val.clientId,
    clientSecret: key.val.clientSecret,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // User.findOrCreate({ githubId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
  }
));

router.get('/failed', function(req, res, next) {
  res.render('auth failed');
});

router.get('/github', passport.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/failed' }),
  function(req, res) {
    res.redirect('/blog/manage');
  }
);

module.exports = router;
