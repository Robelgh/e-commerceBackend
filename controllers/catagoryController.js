var express = require('express');
var router = express.Router();//handles routing paths
var catagoryModel = require('../models/catagoryModel');
var validationRules = require('../validation_rules/rules');
var asyncValidator = require('async-validator-2');
//////////////////////////////
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = "secretkey23456";
var authorization = require('../middlewares/authorization');
////////////////catagory////////
router.post('/createCatagory', (req, res) => {
  ///////////////for image only////////////
  if (!req.files) {
    let ts = Date.now();
    let date_ob = new Date(ts);
    let hour = date_ob.getHours();
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let fullDate = year + "-" + month + "-" + date + "-" + hour;
    const data = {
      catagory_Name: req.body.catagory_Name,
      Description: req.body.Description,
      date: fullDate,
      parent: req.body.parent
    };
    // var seller_id = req.params.id;
    // console.log("name:"+data.catagory_Name)
    var rules = validationRules.catagory.create;
    var validator = new asyncValidator(rules);
    validator.validate(data, (errors, fields) => {
      if (!errors) {
        catagoryModel.createCatagory(data, function (result) {
          //go to userModel.js in models folder and
          //in this there is createuser()function to insert data to database.
          if (result) {
            // console.log(result);
            res.status(200).json({ success: true });
            // res.redirect('/login');
          } else {
            // res.send('Invalid');
            res.status(200).json({ errs: "Invalid credentials!." });
          }
        });
      } else {
        // console.log(fields);
        res.status(200).json({ errs: "not validated!." });
        // res.render('signup', {errs: errors});
      }
    });
    // return res.status(400).send('No files were uploaded.');
  } else {
    var file = req.files.categoryImage;
    var img_name = file.name;

    if (
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/png" ||
      file.mimetype == "image/gif"
    ) {
      file.mv("public/images/" + file.name, function (err) {
        if (err) return res.status(500).send("the errors were" + err);

        //////////////////end for image codes////////////
        let ts = Date.now();
        let date_ob = new Date(ts);
        let hour = date_ob.getHours();
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        let fullDate = year + "-" + month + "-" + date + "-" + hour;
        const data = {
          catagory_Name: req.body.catagory_Name,
          Description: req.body.Description,
          categoryImage: img_name,
          date: fullDate,
          parent: req.body.parent
        };
        // var seller_id = req.params.id;
        var rules = validationRules.catagory.create;
        var validator = new asyncValidator(rules);
        validator.validate(data, (errors, fields) => {
          if (!errors) {
            catagoryModel.createCatagory(data, function (result) {
              //go to userModel.js in models folder and
              //in this there is createuser()function to insert data to database.
              if (result) {
                // console.log(result);
                res.status(200).json({ success: true });
                // res.redirect('/login');
              } else {
                // res.send('Invalid');
                res.status(200).json({ errs: "Invalid credentials!." });
              }
            });
          } else {
            console.log(fields);
            res.status(200).json({ errs: "not validated!." });
            // res.render('signup', {errs: errors});
          }
        });
        /////////start image brace
      });
    }
    /////end brace for image/////////
  } // else/
});

////////////////edit catagory/
router.post('/editCatagory/:id', (req, res) => {
  /////////////imageonly///////////
  if (!req.files) {
    let ts = Date.now();
    let date_ob = new Date(ts);
    let hour = date_ob.getHours();
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let fullDate = year + "-" + month + "-" + date + "-" + hour;
    const data = {
      catagory_Name: req.body.catagory_Name,
      Description: req.body.Description,
      date: fullDate,
      parent: req.body.parent
    };
    var catagory_id = req.params.id;
    // console.log("name:"+data.catagory_Name)
    var rules = validationRules.catagory.update;
    var validator = new asyncValidator(rules);
    validator.validate(data, (errors, fields) => {
      if (!errors) {
        catagoryModel.updateCatagory(catagory_id, data, function (result) {//go to catagoryModel.js in models folder and
          //go to userModel.js in models folder and
          //in this there is createuser()function to insert data to database.
          if (result) {
            // console.log(result);
            res.status(200).json({ success: true });
            // res.redirect('/login');
          } else {
            // res.send('Invalid');
            res.status(200).json({ errs: "Invalid credentials!." });
          }
        });
      } else {
        // console.log(fields);
        res.status(200).json({ errs: "not validated!." });
        // res.render('signup', {errs: errors});
      }
    });
    // return res.status(400).send('No files were uploaded.');
  } else {
    var file = req.files.categoryImage;
    var img_name = file.name;

    if (
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/png" ||
      file.mimetype == "image/gif"
    ) {
      file.mv("public/images/" + file.name, function (err) {
        if (err) return res.status(500).send("the errors were" + err);

        //////////////////end for image codes////////////
        let ts = Date.now();
        let date_ob = new Date(ts);
        let hour = date_ob.getHours();
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        let fullDate = year + "-" + month + "-" + date + "-" + hour;
        const data = {
          catagory_Name: req.body.catagory_Name,
          Description: req.body.Description,
          categoryImage: img_name,
          date: fullDate,
          parent: req.body.parent
        };
        // var seller_id = req.params.id;
        var catagory_id = req.params.id;
        var rules = validationRules.catagory.update;
        var validator = new asyncValidator(rules);
        validator.validate(data, (errors, fields) => {
          if (!errors) {
            catagoryModel.updateCatagory(catagory_id, data, function (result) {
              //go to userModel.js in models folder and
              //in this there is createuser()function to insert data to database.
              if (result) {
                // console.log(result);
                res.status(200).json({ success: true });
                // res.redirect('/login');
              } else {
                // res.send('Invalid');
                res.status(200).json({ errs: "Invalid credentials!." });
              }
            });
          } else {
            console.log(fields);
            res.status(200).json({ errs: "not validated!." });
            // res.render('signup', {errs: errors});
          }
        });
        /////////start image brace
      });
    }
    /////end brace for image/////////
  } // else/
  /////////////end image only/////

});
/////////////end edit///////

//////////catagory delete///
router.get('/deleteCatagory/:id', (req, res) => {
  var id = req.params.id;
  catagoryModel.deleteCatagory(id, (result) => {
    if (result.length == 0) {
      res.status(200).json({ 'product': 'Invalid' });
    }
    else {
      console.log(result);
      res.status(200).json({ success: true });
    }
  });
});
///////end catagory delte///
/////////show all catagory//
router.get('/getAllCatagory', authorization.authenticateJWT, (req, res) => {
  catagoryModel.getAllCatagory((result) => {
    if (!result) {
      res.status(200).json({ 'catagory': result });
    }
    else {
      // console.log(result);
      res.status(200).json({ 'catagory': result });
    }
  });
});
///////////end ///////////////
/////////////end catagory//////
module.exports = router;
