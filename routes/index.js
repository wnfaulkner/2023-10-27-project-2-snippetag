//INDEX ROUTER

const express = require('express');
const router = express.Router();
const passport = require('passport');
const indexController = require("../controllers/index.js")
//const ensureLoggedIn = require('../config/ensureLoggedIn')

router.get('/', indexController.index);

router.get('/profile', indexController.show);

//router.get('/delete-user', indexController.requestDeleteUser)

//router.post('/:id', indexController.confirmDeleteUser)

router.get('/auth/google', passport.authenticate(
  'google',
  {
    scope: ['profile', 'email'], // Requesting the user's profile and email
  }
)); // Google OAuth login route

router.get('/oauth2callback', passport.authenticate(
  'google',
  {
    successRedirect: '/profile',
    failureRedirect: '/'
  }
)); // Google OAuth callback route

router.get('/logout', function(req, res){ // OAuth logout route
  req.logout(function() {
    res.redirect('/');
  });
});

module.exports = router;
