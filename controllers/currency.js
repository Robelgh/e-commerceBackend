var express = require('express');
var router = express.Router();//handles routing paths
var CurrencyModel = require('../models/currency');
var validationRules = require('../validation_rules/rules');
var asyncValidator = require('async-validator-2');
//////////////////////////////
router.post('/createCurrency', (req, res) => {
     var data=req.body

    CurrencyModel.createCurrency(data, function (result){
        if (result.length == 0) {
            res.status(200).json({ 'Wishlist': result });
        }
        else {
            res.status(200).json({ 'Wishlist': result });
        }
    });
    
    res.status(200).json({ success: true });
    /////end array for brace///
});

router.get('/getAllCurrency', (req, res) => {
    var data=req.body

   CurrencyModel.getAllCurrency((result) => {
    
       if (result.length == 0) {
           console.log(result)
        //    res.status(200).json({ 'currency': result });
       }
       else {
           res.status(200).json({ 'currency': result });
    
       }
   });
   

   /////end array for brace///
});
/////////show of that id//
router.post('/editCurrency/:id', (req, res) => {
    var currency_id = req.params.id;
    var data=req.body
    
    CurrencyModel.updateCurrency(currency_id,data, (result) => {
        if (result.length == 0) {
            res.status(200).json({ 'currency': result });
        }
        else {
            res.status(200).json({ 'currency': result });
        }
    });
});


//////////currency delete///
router.get('/deleteCurrency/:id', (req, res) => {
    var id = req.params.id;
    CurrencyModel.deleteCurrency(id, (result) => {
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
