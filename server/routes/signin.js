const express = require('express');
const router = express.Router();

var ClientOAuth2 = require('client-oauth2')
const key = require("../credentials")

/* GET home page. */
router.get('/github', function(req, res, next) {
});

var githubAuth = new ClientOAuth2({
  clientId: key.clientId,
  clientSecret: key.clientSecret,
  accessTokenUri: 'https://github.com/login/oauth/access_token',
  authorizationUri: 'https://github.com/login/oauth/authorize',
  redirectUri: 'http://huitclub/blog',
  scopes: ['notifications', 'gist']
});

var token = githubAuth.createToken('access token', 'optional refresh token', 'optional token type', { data: 'raw user data' })

module.exports = router;
