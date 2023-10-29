const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/user');

passport.use(new GoogleStrategy(
  // Configuration object
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK
  },
  // The verify callback function...
  async function(accessToken, refreshToken, profile, cb) {
    try {
      
      let user = await User.findOne({ googleId: profile.id }); // A user has logged in with OAuth...
      
      if (user) return cb(null, user); // Existing user found, so provide it to passport
      
      user = await User.create({ // We have a new user via OAuth!
        name: profile.displayName,
        googleId: profile.id,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value
      });
      return cb(null, user);
    } catch (err) {
      return cb(err);
    }
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user._id);
});

passport.deserializeUser(async function(userId, cb) {
  // It's nice to be able to use await in-line!
  cb(null, await User.findById(userId));
});
