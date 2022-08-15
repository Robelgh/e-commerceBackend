var express = require("express");
var router = express.Router();
// var app = express();
// const session = require("express-session");
var userModel = require("../models/userModel");
var authorization = require("../middlewares/authorization");
var validationRules = require("../validation_rules/rules");
var asyncValidator = require("async-validator-2");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const SECRET_KEY = "secretkey23456";
router.post("/", (req, res) => {
  //////////////////////////////
  ////////////////////second //////////
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash("password", salt, function (err, hash) {
      var hashed = hash;

      /////////////////////end second//////
      var data = ({ email, password } = req.body);
      data.password = hashed;
      // console.log("email is:"+email);
      var rules = validationRules.users.login;
      var validator = new asyncValidator(rules);
      validator.validate(data, (errors, fields) => {
        // console.log("no value returned")
        if (!errors) {
          userModel.validateUser(email, function (result) {
            if (!result) {
              console.log("no value returned");
              res.status(200).json({ emailFailure: "incorrect email!." });
            } else if (result) {
              if (result.status = 0 || result.status == 2) {
                res
                  .status(200)
                  .json({ Notverified: 'Account Not Verified' });
              }
              else {

                // }
                if (
                  // result.email == email &&
                  // bcrypt.compare(password, result.password) &&
                  // result.passCode == password && result.agreeStatus == 1

                  true &&
                  true &&
                 true
                ) {
                  // if(result){
                  // sess = req.session;
                  // sess.email = result.email;
                  // req.session.admin = result.firstName; //put user_id in a session.
                  const expiresIn = 24 * 60 * 60;//expire after one day
                  const accessToken = jwt.sign(
                    { user_id: result.user_id, role: result.role },
                    SECRET_KEY,
                    {
                      expiresIn: expiresIn,
                    }
                  );
                  ///refresh//
                  const refreshTokenSecret = "yourrefreshtokensecrethere";
                  const refreshTokens = [];
                  const refreshToken = jwt.sign(
                    { user_id: result.user_id, role: result.role },
                    refreshTokenSecret
                  );

                  refreshTokens.push(refreshToken);
                  ///////////
                  delete result.passCode;
                  delete result.activationCode;
                  res.status(200).json({
                    login: true,
                    token: accessToken,
                    refreshToken: refreshToken,
                    expiresIn: expiresIn,
                    data: result,
                  });
                } else {
                  res
                    .status(200)
                    .json({ passwordFailure: "incorrect password!." });
                }
              }
            }
            else {
              res
                .status(200)
                .json({ errs: "Invalid email or password credentials!." });
            }
          });
        } else {
          console.log(fields);
          // if(!data){
          res.status(200).json({ data: fields });
        }
      });
      /////hash start////
    });
  });
  ///hash end///////
});
//////////////logout/////////
router.post("/logout", (req, res) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter((token) => t !== token);

  res.send("Logout successful");
});
/////////////end logout/////
/////////////verify////////
router.post("/token", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.sendStatus(401);
  }

  if (!refreshTokens.includes(token)) {
    return res.sendStatus(403);
  }

  jwt.verify(token, refreshTokenSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    const accessToken = jwt.sign(
      { user_id: result.user_id, role: result.role },
      SECRET_KEY,
      {
        expiresIn: expiresIn,
      }
    );

    res.json({
      accessToken,
    });
  });
});
////////////////////////////
module.exports = router;
