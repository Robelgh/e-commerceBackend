var express = require('express');
var router = express.Router();//handles routing paths
var wishlistModel = require('../models/WishlistModel');
var validationRules = require('../validation_rules/rules');
var asyncValidator = require('async-validator-2');
//////////////////////////////
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = "secretkey23456";
var authorization = require('../middlewares/authorization');
router.post('/createWishlist', (req, res) => {
    for (let i = 0; i < req.body.length; i++) {
        console.log("arrayData:" + JSON.stringify(req.body[i]));
        // let allData=JSON.stringify(req.body[i].user_id);
        const data = {
            product_id: JSON.stringify(req.body[i].product_id),
            user_id: JSON.stringify(req.body[i].user_id),
            //  quantity:JSON.stringify(req.body[i].quantity)
            //  totalPrice } = JSON.stringify(req.body[i]);
        }
        /////////end loop//////
        var rules = validationRules.wishlist.create;
        var validator = new asyncValidator(rules);
        validator.validate(data, (errors, fields) => {
            if (!errors) {
                wishlistModel.createWishlist(data, function (result) {//go to cartModel.js in models folder and
                });
            }
            else {
                console.log(fields);
                res.status(200).json({ 'errs': 'not validated!.' });

            }
        });
        ////array for barace start//
    }
    res.status(200).json({ success: true });
    /////end array for brace///
});

/////////show of that id//
router.get('/editWishlist/:id', (req, res) => {
    var Wishlist_id = req.params.id;
    wishlistModel.getWishlist(Wishlist_id, (result) => {
        if (result.length == 0) {
            res.status(200).json({ 'Wishlist': result });
        }
        else {
            res.status(200).json({ 'Wishlist': result });
        }
    });
});
///////////end ///////////////

////////////////edit wilshit/
router.post('/editWishlist/:id', (req, res) => {
    const data = { product_id, user_id, quantity } = req.body
    var rules = validationRules.wishlist.update;
    var Wishlist_id = req.params.id;
    var validator = new asyncValidator(rules);
    validator.validate(data, (errors, fields) => {
        if (!errors) {
            wishlistModel.updateWishlist(Wishlist_id, data, function (result) {//go to wishlistModel.js in models folder and

                if (result) {
                    console.log(result);
                    res.status(200).json({ success: true });

                }
                else {

                    res.status(200).json({ 'errs': 'Not updated!.' });
                }
            });
        }
        else {
            console.log(fields);
            res.status(200).json({ 'errs': 'not validated!.' });

        }
    });

});
/////////////end edit///////

//////////wilshit delete///
router.get('/deleteWishlist/:id', (req, res) => {
    var id = req.params.id;
    wishlistModel.deleteWishlist(id, (result) => {
        if (result.length == 0) {
            res.status(200).json({ 'Wishlist': 'Invalid wishlist' });
        }
        else {
            console.log(result);
            res.status(200).json({ success: true });
        }
    });
});
///////end cart delte///
/////////show all wishlist//
router.get('/getAllWishlist', (req, res) => {
    wishlistModel.getAllWishlist((result) => {
        if (!result) {
            res.status(200).json({ 'wishlist': result });
        }
        else {
            console.log(result);
            res.status(200).json({ 'wishlist': result });
        }
    });
});
//////////////
/////////show of that id//
router.get('/getWishlists/:user_id', (req, res) => {
    var user_id = req.params.user_id;
    wishlistModel.getWishlist(user_id, (result) => {
        if (result.length == 0) {
            res.status(200).json({ 'wishlist': result });
        }
        else {
            res.status(200).json({ 'wishlist': result });
        }
    });
});
///////////end ///////////////

module.exports = router;
