/*  EXPRESS */
const express = require('express');
const appsss = express();
const session = require('express-session');
var router = express.Router();//handles routing paths
var userModel = require("../models/userModel");
const jwt = require('jsonwebtoken');
const SECRET_KEY = "secretkey23456";
appsss.set('view engine', 'ejs');

appsss.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET'
}));

var passport = require('passport');
var userProfile;
var userToken;
var accessTokens;
var userss;
appsss.use(passport.initialize());
appsss.use(passport.session());
// router.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '26699714693-ilmsaev1so1evv7fnp1sqju01p9rakia.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '6GY5hBQ0amd4h-DaRzeb8jSM';

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  // callbackURL: "http://localhost:3000/auth/google/callback"
  callbackURL: "https://api.adimera.net/auth/google/callback"
},
  function (accessToken, refreshToken, profile, callback) {
    userProfile = profile;
    userToken=accessToken;
    //////////////////////////
    // profile.forEach((element) => {
      let filOne=profile.displayName.split(" ");
      var firtsName=filOne[0];
      var lastName=filOne[1];
      let ts = Date.now();
      let date_ob = new Date(ts);
      let date = date_ob.getDate();
      let month = date_ob.getMonth() + 1;
      let year = date_ob.getFullYear();
      let hour=date_ob.getHours();
      let fullDate = year + "-" + month + "-" + date + "-" + hour;
      const data = {
        email:profile.emails[0].value,
        firstName: firtsName,
        lastName:lastName,
        password:"password",
        role:0,
        status:0,
        date:fullDate
        //  totalPrice } = JSON.stringify(req.body[i]);
      };
      userModel.saveUser(data,(result1) => {

      });
      //////////get allusers//////////
      userModel.getByEmailGoogle(data,(result) => {
        /////////end get all users//////
        const expiresIn = 24 * 60 * 60;
        accessTokens = jwt.sign({ email: data.email }, SECRET_KEY, {
            expiresIn: expiresIn
        });
      //////////////////////////
      console.log("user_id:"+result.user_id);
       userss=result.user_id;
      return callback(null, userProfile,userToken,accessTokens,userss);
          //getby email loop
  });
    //end getby email loop
  }
));
///////the scope: holds both gmail profile and email on the broser
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/error' }),
  function (req, res) {
    // Successful authentication, redirect success.
    // res.status(200).json({ 'sucess': 'success!' +userProfile,userToken,accessTokens,userss});
    // res.status(200).json({ sucess: 'success!',user: userProfile,token:userToken,jwtToken:accessTokens,user_id:userss});
    // res.redirect('/success');
    res.redirect(`http://adimera.net/#/socialoauth?token=${accessTokens}&user_id=${userss}`);
  });

module.exports = router;