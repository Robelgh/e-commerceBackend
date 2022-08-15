const passport = require('passport');
const express = require('express');
var router = express.Router();
///////////////////////
// const express = require('express');
const appFacebook = express();
const session = require('express-session');
// const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
// const routes = require('./routes.js');
// const config = require('./config')
var userModel = require("../models/userModel");
var config = require('../models/facebookConfig');
const jwt = require('jsonwebtoken');
const SECRET_KEY = "secretkey23456";

appFacebook.set('view engine', 'ejs');

appFacebook.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET'
}));
//////////added//
var userProfile;
var userToken;
var accessTokens;
var userss;
/////////end added//////
appFacebook.use(passport.initialize());
appFacebook.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

passport.use(new FacebookStrategy({
  clientID: config.facebookAuth.clientID,
  clientSecret: config.facebookAuth.clientSecret,
  callbackURL: config.facebookAuth.callbackURL,
  profileFields: ["id", "birthday", "email", "first_name", "gender", "last_name", "displayName", "phone_number"],
}, function (accessToken, refreshToken, profile, callback) {
  userProfile = profile;
  userToken = accessToken;
  ///////////////
  //////////////////////////
  // profile.forEach((element) => {
  let filOne = profile.displayName.split(" ");
  var firtsName = filOne[0];
  var lastName = filOne[1];
  const data = {
    email: profile.emails[0].value,
    firstName: firtsName,
    lastName: lastName,
    password: "password",
    role: 0,
    status: 0,
    phone: profile.phone_number
    //  totalPrice } = JSON.stringify(req.body[i]);
  };
  userModel.saveUser(data, (result1) => {

  });
  //////////get allusers//////////
  userModel.getByEmailLinkedIn(data, (result) => {
    /////////end get all users//////
    if (result.length == 0) {
      res.status(200).json({ NOTIFY: 'You have to use email instead of phone number to login.!' });
    }
    else {
      ///////////////////
      if (data.email) {
        const expiresIn = 24 * 60 * 60;
        accessTokens = jwt.sign({ email: data.email }, SECRET_KEY, {
          expiresIn: expiresIn
        });
      }
      else {
        accessTokens = jwt.sign({ phone: data.phone }, SECRET_KEY, {
          expiresIn: expiresIn
        });
      }
      // console.log("user_id:"+users.user_id);
      // console.log("user_id:"+users.email);
      userss = result.user_id;
      //////////////////////////
      // return done(null, userProfile,userToken);
      return callback(null, userProfile, userToken, accessTokens, userss);
      // return callback(null, userProfile);
      //getby email loop
    }///else loop
  });
  //end getby email loop
  // return done(null, profile);
}
));

///////////////////////

router.get('/auth/facebook', passport.authenticate('facebook', {
  scope: ['public_profile', 'email']
}));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    // successRedirect: '/profile',
    failureRedirect: '/error'
  }),
  /////////////
  function (req, res) {
    // Successful authentication, redirect success.
    // res.status(200).json({ sucess: 'success!',user: userProfile,token:userToken,jwtToken:accessTokens,user_id:userss});
    res.redirect(`http://adimera.net/#/socialoauth?token=${accessTokens}&user_id=${userss}`);
  });

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});


module.exports = router;