var express = require('express');
var router = express.Router();//handles routing paths
var cartModel = require('../models/cartModel');
var validationRules = require('../validation_rules/rules');
var asyncValidator = require('async-validator-2');
//////////////////////////////
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = "secretkey23456";
var authorization = require('../middlewares/authorization');
router.post('/createOrder', (req, res) => {
    const data = { product_id, user_id, quantity } = req.query
    var rules = validationRules.cart.create;
    var validator = new asyncValidator(rules);
    validator.validate(data, (errors, fields) => {
        if (!errors) {
            cartModel.createOrder(data, function (result) {//go to cartModel.js in models folder and

                if (result) {
                    console.log(result);
                    res.status(200).json({ success: true });

                }
                else {

                    res.status(200).json({ 'errs': 'Invalid credentials!.' });
                }
            });
        }
        else {
            console.log(fields);
            res.status(200).json({ 'errs': 'not validated!.' });

        }
    });



});
////////////////cart////////
router.post('/createOrder', (req, res) => {
    const data = { product_id, user_id, quantity } = req.body
    var rules = validationRules.cart.create;
    var validator = new asyncValidator(rules);
    validator.validate(data, (errors, fields) => {
        if (!errors) {
            cartModel.createOrder(data, function (result) {//go to cartModel.js in models folder and

                if (result) {
                    console.log(result);
                    res.status(200).json({ success: true });

                }
                else {

                    res.status(200).json({ 'errs': 'Invalid credentials!.' });
                }
            });
        }
        else {
            console.log(fields);
            res.status(200).json({ 'errs': 'not validated!.' });

        }
    });

});
/////////show of that id//
router.get('/editCart/:id', (req, res) => {
    var cart_id = req.params.id;
    cartModel.getCart(cart_id, (result) => {
        if (result.length == 0) {
            res.status(200).json({ 'carts': result });
        }
        else {
            res.status(200).json({ 'carts': result });
        }
    });
});
///////////end ///////////////

////////////////edit cart/
router.post('/editCart/:id', (req, res) => {
    const data = { product_id, user_id, quantity } = req.body
    var rules = validationRules.cart.update;
    var cart_id = req.params.id;
    var validator = new asyncValidator(rules);
    validator.validate(data, (errors, fields) => {
        if (!errors) {
            cartModel.updateCart(cart_id, data, function (result) {//go to cartModel.js in models folder and

                if (result) {
                    console.log(result);
                    res.status(200).json({ success: true });

                }
                else {

                    res.status(200).json({ 'errs': 'Invalid credentials!.' });
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

//////////cart delete///
router.get('/deleteCart/:id', (req, res) => {
    var id = req.params.id;
    cartModel.deleteCart(id, (result) => {
        if (result.length == 0) {
            res.status(200).json({ 'cart': 'Invalid' });
        }
        else {
            console.log(result);
            res.status(200).json({ success: true });
        }
    });
});
///////end cart delte///
/////////show all cart//
router.get('/getAllCart', authorization.authenticateJWT, (req, res) => {
    cartModel.getAllCart((result) => {
        if (!result) {
            res.status(200).json({ 'carts': result });
        }
        else {
            console.log(result);
            res.status(200).json({ 'carts': result });
        }
    });
});
///////////end ///////////////
module.exports = router;
