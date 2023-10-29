//INDEX ROUTER

const express = require('express');
const router = express.Router();
const passport = require('passport');
const indexController = require("../controllers/index.js")

router.get('/', indexController.index);
router.get('/profile', indexController.show);

// Google OAuth login route
router.get('/auth/google', passport.authenticate(
  'google',
  {
    scope: ['profile', 'email'], // Requesting the user's profile and email
  }
));

// Google OAuth callback route
router.get('/oauth2callback', passport.authenticate(
  'google',
  {
    successRedirect: '/profile',
    failureRedirect: '/'
  }
));

// OAuth logout route
router.get('/logout', function(req, res){
  req.logout(function() {
    res.redirect('/');
  });
});

module.exports = router;
