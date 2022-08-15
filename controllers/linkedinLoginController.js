const passport = require('passport');
const express = require('express');
var router = express.Router();
//////////////////////added////////
// const express = require('express');
const applinkedin = express();
const session = require('express-session');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
var userModel = require("../models/userModel");
var config = require('../models/linkedinConfigModel');
const jwt = require('jsonwebtoken');
const SECRET_KEY = "secretkey23456";

applinkedin.set('view engine', 'ejs');

applinkedin.use(session({
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
applinkedin.use(passport.initialize());
applinkedin.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

passport.use(new LinkedInStrategy({
  clientID: config.linkedinAuth.clientID,
  clientSecret: config.linkedinAuth.clientSecret,
  callbackURL: config.linkedinAuth.callbackURL,
  scope: ['r_emailaddress', 'r_liteprofile'],
}, function (token, tokenSecret, profile, callback) {
  userProfile = profile;
  userToken = token;
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
    status: 0
    //  totalPrice } = JSON.stringify(req.body[i]);
  };
  userModel.saveUser(data, (result1) => {

  });
  //////////get allusers//////////
  userModel.getByEmailLinkedIn(data, (result) => {
    /////////end get all users//////
    ///////////////////
    const expiresIn = 24 * 60 * 60;
    accessTokens = jwt.sign({ email: data.email }, SECRET_KEY, {
      expiresIn: expiresIn
    });
    // console.log("user_id:"+users.user_id);
    // console.log("user_id:"+users.email);
    userss = result.user_id;
    //////////////////////////
    // return done(null, userProfile,userToken);
    return callback(null, userProfile, userToken, accessTokens, userss);
    // return callback(null, userProfile);
    //getby email loop
  });
  //end getby email loop
}
));
//////////////end added///////////

router.get('/auth/linkedin', passport.authenticate('linkedin', {
  scope: ['r_emailaddress', 'r_liteprofile'],
}));

router.get('/auth/linkedin/callback',
  passport.authenticate('linkedin', {
    // successRedirect: '/profile',
    failureRedirect: '/login'
  }),
  function (req, res) {
    // Successful authentication, redirect success.
    // res.status(200).json({ sucess: 'success!',user: userProfile,token:userToken,jwtToken:accessTokens,user_id:userss});
    res.redirect(`http://adimera.net/#/socialoauth?token=${accessTokens}&user_id=${userss}`);
  }
);

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;