// ensureLoggedIn.js

// Middleware for routes that require a logged in user
module.exports = function(req, res, next) {
  console.log(req.isAuthenticated())
  if ( req.isAuthenticated() ) return next() // Pass the req/res to the next middleware/route handler
  res.redirect('/auth/google') // Redirect to login if the user is not already logged in
}