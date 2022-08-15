var express = require('express');
var router = express.Router();//handles routing paths
var userModel = require('../models/userModel');
var validationRules = require('../validation_rules/rules');
var asyncValidator = require('async-validator-2');
var authorization = require("../middlewares/authorization");
////////////////////////////// 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = "secretkey23456";
var fs = require('fs');
/////////show ser of that id//
router.get('/edit/:id', (req, res) => {
    var user_id = req.params.id;
    userModel.getProfile(user_id, (result) => {
        if (result.length == 0) {
            res.status(200).json({ 'User': result });
        }
        else {
            res.status(200).json({ 'User': result });
        }
    });
});
///////////end ///////////////

////////////////edit user/
router.post('/edit/:id', (req, res) => {
    ///////////////for image only////////////

    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    var file = req.files.profilePicture;
    var img_name = file.name;

    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {

        file.mv('public/images/' + file.name, function (err) {

            if (err)
                return res.status(500).send("the errors were" + err);

            //////////////////end for image codes////////////
            // var user_id=req.params;
            const data = { firstName, lastName, phone, email, role, password, address, profilePicture, gender, activationCode, passCode } = req.body;
            // const data = { name, phone, email, status, password, address, profilePicture, gender } = req.body;
            data.profilePicture = img_name;
            var user_id = req.params.id;
            var rules = validationRules.users.update;
            var validator = new asyncValidator(rules);
            validator.validate(data, (errors, fields) => {
                if (!errors) {
                    userModel.updateProfile(user_id, data, function (result) {//go to userModel.js in models folder and
                        //in this there is createuser()function to insert data to database.
                        if (result) {
                            console.log(result);
                            res.status(200).json({ success: true });
                            // res.redirect('/login');
                        }
                        else {
                            // res.send('Invalid');
                            res.status(200).json({ 'errs': 'Invalid credentials!.' });
                        }
                    });
                }
                else {
                    console.log(fields);
                    res.status(200).json({ 'errs': 'not validated!.' });
                    // res.render('signup', {errs: errors});
                }
            });
            /////////start image brace
        });
    }
    /////end brace for image/////////
});
/////////////end edit///////

//////////user delete///
router.get('/delete/:id', (req, res) => {
    var id = req.params.id;
    userModel.deleteProfile(id, (result) => {
        if (result.length == 0) {
            res.status(200).json({ 'User': 'Invalid' });
        }
        else {
            console.log(result);
            res.status(200).json({ 'User': 'User Completely Deleted!' });
        }
    });
});
///////end user delte///
/////////show all users//
router.get('/getAllProfile/:user_id', (req, res) => {
    var user_id = req.params.user_id;
    //sessionStorage.getItem("sessionEmails");
    userModel.getAllProfile(user_id, (result) => {
        if (!result) {
            res.status(200).json({ 'User': result });
        }
        else {
            res.status(200).json({ 'User': result });
        }
    });
});
///////////end ///////////////
///////////////change profile
module.exports = router;
