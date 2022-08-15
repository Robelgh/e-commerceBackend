var express = require('express');
var router = express.Router(); //handles routing paths
var productModel = require('../models/productModel');
var delivery=require('../models/deliveryModel');
var packaging=require('../models/Packaging')
var validationRules = require('../validation_rules/rules');
var asyncValidator = require('async-validator-2');
var db = require("../models/config");
var catagoryModel = require("../models/catagoryModel");
//////////////////////////////
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = "secretkey23456";
var fs = require('fs');
var authorization = require('../middlewares/authorization');
router.post('/createProduct', (req, res) => {
    ///////////////for image only////////////

    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    var file = req.files.Image;
    var img_name = file.name;
    console.log(file.name)

    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {

        file.mv('public/images/' + file.name, function (err) {

            if (err)
                return res.status(500).send("the errors were" + err);

            //////////////////end for image codes////////////
            let ts = Date.now();
            let date_ob = new Date(ts);
            let date = date_ob.getDate();
            let month = date_ob.getMonth() + 1;
            let year = date_ob.getFullYear();
            let hour = date_ob.getHours();
            let fullDate = year + "-" + month + "-" + date + "-" + hour;
            // const data = { Category_id, Name, Description, Code, Price, Image,date } = req.body;
            const data = {
                Category_id,
                Name,
                Description,
                Code,
                Price,
                Image,
                uploadedBy,
                date,
                color,
                size,
                quantity,
                totalRate
            } = req.body;
            data.Image = img_name;
            data.totalRate = 0
            // data.Name=data.Name.toLowerCase();
            data.date = fullDate;
            data.Name = Name.toLowerCase();
            var rules = validationRules.products.create;
            var validator = new asyncValidator(rules);
            validator.validate(data, (errors, fields) => {
                if (!errors) {
                    productModel.createProduct(data, function (result) { //go to productModel.js in models folder and

                        if (result) {
                            console.log(result);
                            res.status(200).json({
                                success: true
                            });

                        } else {

                            res.status(200).json({
                                'errs': 'Invalid credentials!.'
                            });
                        }
                    });
                } else {
                    console.log(fields);
                    res.status(200).json({
                        'errs': 'not validated!.'
                    });

                }
            });
            /////////start image brace
        });
    }
    /////end brace for image/////////
});

/////////show of that id//

router.get('/getDelivery/:id',(req,res)=>
{
    console.log("this is from get deliveryyyy")
    var product_id = req.params.id;
    console.log("product id :"+ product_id)

    delivery.getDelivery(product_id,(result)=>
    {
        res.status(200).json({
            'delivery': result
        });
    })

})

router.get('/getpackage/:id',(req,res)=>
{
    console.log("this is from get deliveryyyy")
    var product_id = req.params.id;
    console.log("product id :"+ product_id)

    packaging.getpackage(product_id,(result)=>
    {
        res.status(200).json({
            'packaging': result
        });
    })

})

router.get('/getProduct/:id', (req, res) => {

    var product_id = req.params.id;
    const data = {
        product_id: product_id
    }
    productModel.getProduct(product_id, (result) => {
        if (result.length == 0) {
            res.status(200).json({
                'product': result
            });
        } else {
            /////////////////////
            var totalRate;
            productModel.getRatingByProductID(data, (result1) => {
                if (result1.length == 0) {
                    totalRate = 0;
                } else {
                    // console.log(result);
                    ///////////////////////
                    var sum = 0;
                    var count = 0;
                    result1.forEach((element) => {
                        
                        // collectionss.push({
                        if (element.ratingValues) {
                            sum = sum + element.ratingValues;
                            count = count + 1;
                        }
                    });
                    totalRate = sum / count;
                }
                /////////////////collections//////////////
                var collectionss = [];
                console.log("result")
                console.log(result)
                result.forEach((elements) => {
                    collectionss.push({
                        id: elements.id,
                        Category_id: elements.Category_id,
                        Name: elements.Name,
                        Description: elements.Description,
                        Price: elements.Price,
                        uploadedBy: elements.uploadedBy,
                        date: elements.date,
                        color: elements.color,
                        size: elements.size,
                        quantity: elements.quantity,
                        totalRate: totalRate,
                        weight:elements.weight,
                        orgin:elements.orgin,
                        available:elements.Available,
                        age:elements.age
                    });
                });
                return res.status(200).json(collectionss[0]);
                ////////////////////end collections///////
            });
            ////////////////////
            // res.status(200).json({ result });
        }
    });

   
});
///////////end ///////////////

////////////////edit product/
router.post('/editProduct/:id', (req, res) => {
    // router.post('/create', (req, res) => {
    ///////////////for image only////////////

    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    var file = req.files.Image;
    var img_name = file.name;

    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {

        file.mv('public/images/' + file.name, function (err) {

            if (err)
                return res.status(500).send("the errors were" + err);

            //////////////////end for image codes////////////
            let ts = Date.now();
            let date_ob = new Date(ts);
            let date = date_ob.getDate();
            let month = date_ob.getMonth() + 1;
            let year = date_ob.getFullYear();
            let hour = date_ob.getHours();
            let fullDate = year + "-" + month + "-" + date + "-" + hour;
            // const data = { Category_id, Name, Description, Code, Price, Image,date } = req.body;
            const data = {
                Category_id,
                Name,
                Description,
                Code,
                Price,
                Image,
                uploadedBy,
                date,
                color,
                size,
                quantity,
            } = req.body;
            data.Image = img_name;
            data.date = fullDate;
            data.Name = Name.toLowerCase();
            var rules = validationRules.products.update;
            var id = req.params.id;
            var validator = new asyncValidator(rules);
            validator.validate(data, (errors, fields) => {
                if (!errors) {
                    productModel.updateProduct(id, data, function (result) { //go to productModel.js in models folder and

                        if (result) {
                            console.log(result);
                            res.status(200).json({
                                success: true
                            });

                        } else {

                            res.status(200).json({
                                'errs': 'Invalid credentials!.'
                            });
                        }
                    });
                } else {
                    console.log(fields);
                    res.status(200).json({
                        'errs': 'not validated!.'
                    });

                }
            });
            /////////start image brace
        });
    }
    /////end brace for image/////////
});
/////////////end edit///////

//////////product delete///
router.get('/deleteProduct/:id', (req, res) => {
    var id = req.params.id;
    productModel.deleteProduct(id, (result) => {
        if (result.length == 0) {
            res.status(200).json({
                'product': 'Invalid'
            });
        } else {
            console.log(result);
            res.status(200).json({
                success: true
            });
        }
    });
});
///////end product delte///
/////////show all productss//
router.get('/getAllProducts', authorization.authenticateJWT, (req, res) => {
    productModel.getAllProducts((result) => {
        if (!result) {
            res.status(200).json({
                'product': result
            });
        } else {
            // console.log(result);
            res.status(200).json({
                'product': result
            });
        }
    });
});
router.get('/getUserProducts', authorization.authenticateJWT, (req, res) => {
    productModel.getUserProducts((result) => {
        if (!result) {
            res.status(200).json({
                'product': result
            });
        } else {
            console.log(result);
            res.status(200).json({
                'product': result
            });
        }
    });
});
///////////end ///////////////
/////////show ser of that id//
router.get("/searchProducts/:name", authorization.authenticateJWT, (req, res) => {
    var user_id = "%" + req.params.name;
    var pid = req.params.name;
    var c1 = pid.charAt(0);
    // console.log(c1);
    var productName = "%" + pid.substring(0, 2).toLowerCase() + "%";
    // console.log("the substring is:"+str);
    productModel.searchProductsByCategory(productName, (resultc) => {
        // if (resultc.length == 0) {
        //   //////////added////////
        //   res.status(200).json({ products: resultc });
        // } else {
        /////////////////////////
        productModel.searchProducts(productName, (result) => {
            if (result.length == 0) {
                //////////added/////////
                var catagoryID = resultc.id;
                console.log("catagoryID:" + catagoryID);
                productModel.productByCatagoryID(catagoryID, (resultc1) => {
                    if (resultc1.length == 0) {
                        res.status(200).json({ products: resultc1 });
                    } else {
                        res.status(200).json({ products: resultc1 });
                    }
                });
                ////////////added//////
                // res.status(200).json({ products: result });
            } else {
                res.status(200).json({ products: result });
            }
        });
        /////////////////////
        // res.status(200).json({ products: result });
        // }
    });

});
router.get('/getSimilarProducts/:c_id', (req, res) => {
    var Category_id = req.params.c_id;
    productModel.getSimilarProducts(Category_id, (result) => {
        if (result.length == 0) {
            //////////////////////
            // var catagoryID=resultc.id;
            // console.log("catagoryID:"+catagoryID);
            productModel.productNameByCatagoryID(Category_id, (resultc1) => {
                if (resultc1) {
                    ////////select cid by name
                    var catagoryName = resultc1.catagory_Name;
                    var productName = "%" + catagoryName.substring(0, 2).toLowerCase() + "%";
                    //////////////////////////
                    productModel.getProductByCategoryID(productName, (resultc2) => {
                        // if (resultc2.length == 0) {
                        //   res.status(200).json({ products: resultc2 });
                        // } else {
                        res.status(200).json({ products: resultc2 });
                        // }
                    });
                    /////////////////////////
                    // res.status(200).json({ products: resultc1 });
                }
                else {
                    res.status(200).json({ products: resultc2 });
                }
            });

            // res.status(200).json({
            //     'products': result
            // });
        } else {
            /////////////////make dynamic for subcatagory table/////////////
            var sql = "DELETE FROM subcategory";
            db.executeQuery(sql, [null], function (resultd) {
                // callback(result);
            });
            ///////////////////end dynamic catagory table///////////////////
            ///////////insert to subcatatgory table////////////
            ///////////one insertion///
            var sql = "SELECT * FROM category WHERE id = ?";
            db.executeQuery(sql, [Category_id], function (result2) {
                var catagoryID = result2[0].id
                console.log("catagoryID:" + catagoryID)
                var catagory_Names = result2[0].catagory_Name
                var parents = result2[0].parent;
                var pernt = catagoryID;
                var sql = "INSERT INTO  subcategory VALUES(null, ?, ?, ?)";
                db.executeQuery(
                    sql,
                    [
                        catagory_Names,
                        pernt,
                        catagoryID
                    ],
                    function (result) {
                        // callback(result);
                    }
                );
            }
            );
            ////////////one isertion////
            ///////////insert to subcatatgory table////////////
            var sql = "SELECT * FROM category WHERE parent= ?";
            db.executeQuery(sql, [Category_id], function (result3) {
                if (result3.length == 0) {
                    catagoryModel.catagoryProducts(Category_id, (result) => {
                        if (result.length == 0) {
                            res.status(200).json({ products: result });
                        } else {
                            res.status(200).json({ products: result });
                        }
                    });
                }
                else {
                    result3.forEach((element) => {
                        var catagoryID = element.id
                        var catagory_Name = element.catagory_Name
                        var parent = element.parent
                        var sql = "INSERT INTO  subcategory VALUES(null, ?, ?, ?)";
                        db.executeQuery(
                            sql,
                            [
                                catagory_Name,
                                parent,
                                catagoryID
                            ],
                            function (result) {
                                // callback(result);
                            }
                        );
                    });
                    // })
                    //////////////end insert to sub catagory table/////
                    var sql =
                        "SELECT  product.Name,product.uploadedBy,product.quantity,product.totalRate,product.Category_id, product.id, product.Code,product.Description,product.color, product.size, product.Price, product.Image,subcategory.catagory_Name,subcategory.parent FROM product LEFT JOIN subcategory ON product.Category_id = subcategory.catagory_id WHERE product.quantity >0 ORDER BY product.id DESC";
                    db.executeQuery(sql, [null], function (result1) {
                        // callback(result);
                        res.status(200).json({ products: result1 });
                    });
                }/////
            });
            // res.status(200).json({
            //     'products': result
            // });
        }
    });
});
////////////////end product/////////
//////////////////producting rating value/////
////////////////product specification start////////////
router.post('/createProductRating', (req, res) => {
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hour = date_ob.getHours();
    let fullDate = year + "-" + month + "-" + date + "-" + hour;
    const data = {
        user_id,
        product_id,
        ratingValues,
        date
    } = req.body;
    data.date = fullDate;
    var pro_id = data.product_id;
    var rules = validationRules.Rating.create;
    var validator = new asyncValidator(rules);
    validator.validate(data, (errors, fields) => {
        if (!errors) {
            /////////rating check/////
            productModel.getRatingProducts(data, (result) => {
                if (result.length == 0) {
                    /////////end check///////
                    productModel.createPrRating(data, function (result) { //go to productModel.js in models folder and

                        if (result) {
                            // console.log(result);
                            //////////////////update product table by rate////////
                            /////////////////////
                            var totalRate;
                            productModel.getRatingByProductID(data, (result1) => {
                                if (result1.length == 0) {
                                    totalRate = 0;
                                } else {
                                    // console.log(result);
                                    ///////////////////////
                                    var sum = 0;
                                    var count = 0;
                                    result1.forEach((element) => {
                                        // collectionss.push({
                                        if (element.ratingValues) {
                                            sum = sum + element.ratingValues;
                                            count = count + 1;
                                        }
                                    });
                                    totalRate = sum / count;
                                }
                                productModel.updateProductRate(data, totalRate, (result2) => {

                                })
                            });
                            //////////////////end update product table by rate/////
                            res.status(200).json({
                                success: true
                            });

                        } else {

                            res.status(200).json({
                                'errs': 'Invalid credentials!.'
                            });
                        }
                    });
                    ////checking///////
                } else {
                    ////start update///
                    console.log("productid:" + pro_id);
                    productModel.updatePrRating(pro_id, data, function (result1) { //go to productModel.js in models folder and

                        if (result1) {
                            // console.log(result1);
                            //////////////////update product table by rate////////
                            var totalRate;
                            productModel.getRatingByProductID(data, (result3) => {
                                if (result3.length == 0) {
                                    totalRate = 0;
                                } else {
                                    // console.log(result);
                                    ///////////////////////
                                    var sum = 0;
                                    var count = 0;
                                    result3.forEach((element) => {
                                        // collectionss.push({
                                        if (element.ratingValues) {
                                            sum = sum + element.ratingValues;
                                            count = count + 1;
                                        }
                                    });
                                    totalRate = sum / count;
                                }
                                productModel.updateProductRate(data, totalRate, (result2) => {

                                })
                            });
                            //////////////////end update product table by rate/////
                            res.status(200).json({
                                'success': 'successfully updated!.'
                            });

                        } else {

                            res.status(200).json({
                                'errs': 'Invalid credentials!.'
                            });
                        }
                    });
                    /////end update///
                    // res.status(200).json({ 'result':result });
                }
            });
            /////end checking//
        } else {
            console.log(fields);
            res.status(200).json({
                'errs': 'not validated!.'
            });

        }
    });
});
/////////show all productss//
router.get('/getAllProductRating', authorization.authenticateJWT, (req, res) => {
    productModel.getAllProductRating((result) => {
        if (!result) {
            res.status(200).json({
                'result': result
            });
        } else {
            // console.log(result);
            res.status(200).json({
                'result': result
            });
        }
    });
});
router.get('/getRatingProducts/:c_id', (req, res) => {
    var pr_id = req.params.c_id;
    productModel.getRatingProducts(pr_id, (result) => {
        if (result.length == 0) {
            res.status(200).json({
                'result': result
            });
        } else {
            res.status(200).json({
                'result': result
            });
        }
    });
});

router.post('/getRatingByProductID', authorization.authenticateJWT, (req, res) => {
    const data = {
        user_id,
        product_id,
        ratingValues,
        date
    } = req.body;
    productModel.getRatingByProductID(data, (result1) => {
        if (result1.length == 0) {
            res.status(200).json({
                'result': result1
            });
        } else {
            // console.log(result);
            ///////////////////////
            var sum = 0;
            var count = 0;
            result1.forEach((element) => {
                // collectionss.push({
                if (element.ratingValues) {
                    sum = sum + element.ratingValues;
                    count = count + 1;
                }
            });
            // console.log("total values:"+sum);
            // console.log("total count:"+count);
            //   });
            var totalRate = sum / count;
            return res.status(200).json({
                totalRate: totalRate,
                sum: sum,
                count: count
            });
            ////////////////////////
            // res.status(200).json({ 'result': result });
        }
    });
});
/////////////////end producting rating value//
///////highest purchased vaues/////////////
router.get('/getPopularProducts', authorization.authenticateJWT, (req, res) => {
    // var pr_limit = req.params.limit;
    productModel.getPopulatedProducts((result) => {
        if (result.length == 0) {
            // res.status(200).json({
            //     'result': result
            // });
            productModel.getPopularProductsByRate((result1) => {
                if (result1.length == 0) {
                    productModel.getPopularProductsByIdNum((result2) => {
                        res.status(200).json({ 'result': result2 });
                    })
                }
                else {
                    res.status(200).json({ 'result': result1 });
                }
            })
        } else {
            res.status(200).json({
                'result': result
            });
        }
    });
});
/////////////end purchased values//////////
////////////////product color start////////////
router.post('/createProductColor', (req, res) => {
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hour = date_ob.getHours();
    let fullDate = year + "-" + month + "-" + date + "-" + hour;
    const data = {
        product_id,
        date,
        colourName
    } = req.body;
    data.date = fullDate;
    var rules = validationRules.Color.create;
    var validator = new asyncValidator(rules);
    validator.validate(data, (errors, fields) => {
        if (!errors) {
            productModel.createProductColor(data, function (result) { //go to productModel.js in models folder and

                if (result) {
                    console.log(result);
                    res.status(200).json({
                        success: true
                    });

                } else {

                    res.status(200).json({
                        'errs': 'Invalid credentials!.'
                    });
                }
            });
        } else {
            console.log(fields);
            res.status(200).json({
                'errs': 'not validated!.'
            });

        }
    });
});

////////////////edit product/
router.post('/editProductColor/:id', (req, res) => {
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hour = date_ob.getHours();
    let fullDate = year + "-" + month + "-" + date + "-" + hour;
    const data = {
        product_id,
        date,
        colourName
    } = req.body;
    data.date = fullDate;
    var rules = validationRules.Color.update;
    var id = req.params.id;
    var validator = new asyncValidator(rules);
    validator.validate(data, (errors, fields) => {
        if (!errors) {
            productModel.updateProductColor(id, data, function (result) { //go to productModel.js in models folder and

                if (result) {
                    console.log(result);
                    res.status(200).json({
                        success: true
                    });

                } else {

                    res.status(200).json({
                        'errs': 'Invalid credentials!.'
                    });
                }
            });
        } else {
            console.log(fields);
            res.status(200).json({
                'errs': 'not validated!.'
            });

        }
    });
});

/////////show all productss//
router.get('/getAllProductColour/:pcolour', (req, res) => {
    var prcolour = req.params.pcolour;
    productModel.getAllProductColour(prcolour, (result) => {
        if (!result) {
            res.status(200).json({
                'result': result
            });
        } else {
            // console.log(result);
            res.status(200).json({
                'result': result
            });
        }
    });
});
router.get('/deleteProductColor/:id', (req, res) => {
    var id = req.params.id;
    productModel.deleteProductColor(id, (result) => {
        if (result.length == 0) {
            res.status(200).json({
                'product': 'Invalid'
            });
        } else {
            console.log(result);
            res.status(200).json({
                success: true
            });
        }
    });
});
////////////////end product color//////////////
////////////////product size start////////////
router.post('/createProductSize', (req, res) => {
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hour = date_ob.getHours();
    let fullDate = year + "-" + month + "-" + date + "-" + hour;
    const data = {
        product_id,
        date,
        sizeName
    } = req.body;
    data.date = fullDate;
    var rules = validationRules.Size.create;
    var validator = new asyncValidator(rules);
    validator.validate(data, (errors, fields) => {
        if (!errors) {
            productModel.createProductSize(data, function (result) { //go to productModel.js in models folder and

                if (result) {
                    console.log(result);
                    res.status(200).json({
                        success: true
                    });

                } else {

                    res.status(200).json({
                        'errs': 'Invalid credentials!.'
                    });
                }
            });
        } else {
            console.log(fields);
            res.status(200).json({
                'errs': 'not validated!.'
            });

        }
    });
});

////////////////edit product/
router.post('/editProductSize/:id', (req, res) => {
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hour = date_ob.getHours();
    let fullDate = year + "-" + month + "-" + date + "-" + hour;
    const data = {
        product_id,
        date,
        sizeName
    } = req.body;
    data.date = fullDate;
    var rules = validationRules.Size.update;
    var id = req.params.id;
    var validator = new asyncValidator(rules);
    validator.validate(data, (errors, fields) => {
        if (!errors) {
            productModel.updateProductSize(id, data, function (result) { //go to productModel.js in models folder and

                if (result) {
                    console.log(result);
                    res.status(200).json({
                        success: true
                    });

                } else {

                    res.status(200).json({
                        'errs': 'Invalid credentials!.'
                    });
                }
            });
        } else {
            console.log(fields);
            res.status(200).json({
                'errs': 'not validated!.'
            });

        }
    });
});

/////////show all productss//
router.get('/getAllProductSize/:prsize', (req, res) => {
    var prodSize = req.params.prsize;
    productModel.getAllProductSize(prodSize, (result) => {
        if (!result) {
            res.status(200).json({
                'result': result
            });
        } else {
            // console.log(result);
            res.status(200).json({
                'result': result
            });
        }
    });
});
router.get('/deleteProductSize/:id', (req, res) => {
    var id = req.params.id;
    productModel.deleteProductSize(id, (result) => {
        if (result.length == 0) {
            res.status(200).json({
                'product': 'Invalid'
            });
        } else {
            console.log(result);
            res.status(200).json({
                success: true
            });
        }
    });
});
////////////////end product size//////////////
////////////////product size start////////////
router.post('/createProductReview', (req, res) => {
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hour = date_ob.getHours();
    let fullDate = year + "-" + month + "-" + date + "-" + hour;
    const data = {
        product_id,
        user_id,
        date,
        text,
        productName
    } = req.body;
    data.date = fullDate;
    var rules = validationRules.Preview.create;
    var validator = new asyncValidator(rules);
    validator.validate(data, (errors, fields) => {
        if (!errors) {
            productModel.createProductPreview(data, function (result) { //go to productModel.js in models folder and

                if (result) {
                    console.log(result);
                    res.status(200).json({
                        success: true
                    });

                } else {

                    res.status(200).json({
                        'errs': 'Invalid credentials!.'
                    });
                }
            });
        } else {
            console.log(fields);
            res.status(200).json({
                'errs': 'not validated!.'
            });

        }
    });
});

////////////////edit product/
router.post('/editProductReview/:id', (req, res) => {
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hour = date_ob.getHours();
    let fullDate = year + "-" + month + "-" + date + "-" + hour;
    const data = {
        date,
        text
    } = req.body;
    data.date = fullDate;
    // console.log("all datas:"+data.product_id+"userid"+data.user_id)
    var rules = validationRules.Preview.update;
    var id = req.params.id;
    var validator = new asyncValidator(rules);
    validator.validate(data, (errors, fields) => {
        if (!errors) {
            productModel.updateProductPreview(id, data, function (result) { //go to productModel.js in models folder and

                if (result) {
                    console.log(result);
                    res.status(200).json({
                        success: true
                    });

                } else {

                    res.status(200).json({
                        'errs': 'Invalid credentials!.'
                    });
                }
            });
        } else {
            console.log(fields);
            res.status(200).json({
                'errs': 'not validated!.'
            });

        }
    });
});

/////////show all productss//
router.get('/getAllProductReview/:prvid', (req, res) => {
    var prview_id = req.params.prvid;
    productModel.getAllProductPreview(prview_id, (result) => {
        if (!result) {
            res.status(200).json({
                'result': result
            });
        } else {
            // console.log(result);
            res.status(200).json({
                'result': result
            });
        }
    });
});
router.get('/deleteProductReview/:id', (req, res) => {
    var id = req.params.id;
    productModel.deleteProductReview(id, (result) => {
        if (result.length == 0) {
            res.status(200).json({
                'product': 'Invalid'
            });
        } else {
            console.log(result);
            res.status(200).json({
                success: true
            });
        }
    });
});
////////////////end product size//////////////
////////////////coupons start////////////
router.post('/createCoupon', (req, res) => {
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hour = date_ob.getHours();
    var codes = (Math.floor(Math.random() * 100000) + 100000)
    let fullDate = year + "-" + month + "-" + date + "-" + hour;
    const data = {
        code,
        firstDate,
        endDate,
        percentage
    } = req.body;
    // data.firstDate=fullDate;
    // data.code=codes;
    console.log("datas:" + data.code, data.firstDate, data.endDate, data.percentage)
    var rules = validationRules.Coupon.create;
    var validator = new asyncValidator(rules);
    validator.validate(data, (errors, fields) => {
        if (!errors) {
            productModel.createCoupon(data, function (result) { //go to productModel.js in models folder and

                if (result) {
                    ///////////////// start expire time //////
                    // productModel.getAllCoupon((result) => {
                    //     if (!result) {
                    //         res.status(200).json({ 'result': result });
                    //     }
                    //     else {
                    //         result.forEach((element) => {
                    //             // collectionss.push({
                    //                 let startDates=element.firstDate;
                    //                 let endDates=element.endDate;
                    //                 let id=element.id;
                    //                 let filOne=startDates.split("-");
                    //                 let filTwo=endDates.split("-");
                    //                 console.log("splittedData:"+filOne[3]);
                    //                 // var allDatasts=filOne[3];
                    //              if(filOne[0]==filTwo[0] &&filOne[1]==filTwo[1]&&filOne[2]==filTwo[2]&&filOne[3]==filTwo[3])
                    //              {
                    //         //////////////////////
                    //         var sql = "DELETE FROM coupon WHERE id = ?";
                    //         db.executeQuery(sql, [id], function (result) {
                    //         //   callback(result);
                    //         });
                    //         /////////////////////
                    //              }
                    //             });   
                    //     }
                    //     });
                    /////////////////end expire//////////////////
                    console.log(result);
                    res.status(200).json({
                        success: true
                    });

                } else {

                    res.status(200).json({
                        'errs': 'Invalid credentials!.'
                    });
                }
            });
        } else {
            console.log(fields);
            res.status(200).json({
                'errs': 'not validated!.'
            });

        }
    });
});

////////////////edit coupon/
router.post('/editCoupon/:id', (req, res) => {
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hour = date_ob.getHours();
    let fullDate = year + "-" + month + "-" + date + "-" + hour;
    var codes = (Math.floor(Math.random() * 100000) + 100000)
    const data = {
        code,
        firstDate,
        endDate,
        percentage
    } = req.body;
    // data.firstDate=fullDate;
    // data.code=codes;
    var rules = validationRules.Coupon.update;
    var id = req.params.id;
    var validator = new asyncValidator(rules);
    validator.validate(data, (errors, fields) => {
        if (!errors) {
            productModel.updateCoupon(id, data, function (result) { //go to productModel.js in models folder and

                if (result) {
                    console.log(result);
                    res.status(200).json({
                        success: true
                    });

                } else {

                    res.status(200).json({
                        'errs': 'Invalid credentials!.'
                    });
                }
            });
        } else {
            console.log(fields);
            res.status(200).json({
                'errs': 'not validated!.'
            });

        }
    });
});

/////////show all coupon//
router.get('/getAllCoupon', authorization.authenticateJWT, (req, res) => {
    // var coupons=req.params.coupon;
    productModel.getAllCoupon((result) => {
        if (!result) {
            res.status(200).json({
                'result': result
            });
        } else {
            // console.log(result);
            res.status(200).json({
                'result': result
            });
        }
    });
});
router.get('/deleteCoupon/:id', (req, res) => {
    var id = req.params.id;
    productModel.deleteCoupon(id, (result) => {
        if (result.length == 0) {
            res.status(200).json({
                'product': 'Invalid'
            });
        } else {
            // console.log(result);
            res.status(200).json({
                success: true
            });
        }
    });
});
router.get('/deleteAllCoupon', (req, res) => {
    productModel.deleteAllCoupon((result) => {
        if (result.length == 0) {
            res.status(200).json({
                'product': 'Invalid'
            });
        } else {
            console.log(result);
            res.status(200).json({
                success: true
            });
        }
    });
});
router.post('/checkCouponCode', (req, res) => {
    var code = req.body.code;
    productModel.checkCouponCode(code, (result) => {
        if (result.length == 0) {
            res.status(200).json({
                success: false
            });
        } else {
            // console.log(result);
            res.status(200).json({
                success: true,
                result
            });
        }
    });
});
////////////////end coupons//////////////
////////////////////////////////////////////////
router.get('/getAllProductsImages', (req, res) => {
    productModel.getAllProductsImages((result) => {
        if (!result) {
            res.status(200).json({
                'product': result
            });
        } else {
            return res.status(200).json({
                productImages: result
            });
        }
    });
});
////////////////////////////////////////////////
router.get('/getAllProductsImagesData', (req, res) => {
    productModel.getAllProductsImages((result) => {
        if (!result) {
            res.status(200).json({
                'product': result
            });
        } else {
            ///////////////////////////////
            // https://github.com/RCNDC/yehagere_back_end.git
            ////////////////start of making unique////////////
            function removeDuplicates(data, key) {

                return [
                    ...new Map(data.map(item => [key(item), item])).values()
                ]

            };
            var clean = removeDuplicates(result, item => item.id);
            ////////////////////////////////////////
            for (let i = 0; i < clean.length; i++) {
                console.log("clean:" + clean[i].id)
                var uniqueID = clean[0].id;
                var collectionss = [];
                var images = [];
                result.forEach((element) => {
                    if (uniqueID == element.id) {
                        var image = {
                            product_image: element.product_image
                        }
                        collectionss.push({
                            //   id: element.id,
                            //   id: element.id,
                            image
                            //   'images':[{
                            //     product_image: element.product_image,
                            //   }]

                            //   Name: element.Name,
                            //   Description: element.Description,
                            //   Price: element.Price,
                        });
                        collectionss.push({
                            id: element.id
                        })
                    } else { }
                });
            } //for loop
            return res.status(200).json({
                products: collectionss
            });
        }
    });
});
///////////end ///////////////
module.exports = router;
