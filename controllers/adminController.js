var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var userModel = require('../models/userModel');
var delivery=require('../models/deliveryModel');
var packaging=require('../models/Packaging')
var productModel = require('../models/productModel');
var catagoryModel = require('../models/catagoryModel');
var cartModel = require('../models/cartModel');
var wishlistModel = require('../models/WishlistModel');
var userChatModel = require('../models/userChatModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = "secretkey23456";
var authorization = require('../middlewares/authorization');
var db = require('../models/config');
// var bookModel = require.main.require('./models/bookModel');
var validationRules = require('../validation_rules/rules');
var asyncValidator = require('async-validator-2');
var fs = require('fs');
router.post('/createSeller', (req, res) => {

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash("password", salt, function (err, hash) {
            var hashed = hash;
            //   console.log(hashed)
            ///////////////end/////////////////
            var code = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
            // data.activationCode=code;
            // data.status = 0;
            let passCodess = req.body.password;
            let statuss = 1;
            /////////////date/////////
            let ts = Date.now();
            let date_ob = new Date(ts);
            let hour = date_ob.getHours();
            let date = date_ob.getDate();
            let month = date_ob.getMonth() + 1;
            let year = date_ob.getFullYear();
            //   getHours: returns the hour of the day in 24-hour format (0-23)
            //   getMinutes: returns the minute (0-59)
            //   getSeconds: returns the seconds (0-59)
            // prints date & time in YYYY-MM-DD format
            let role = 2;
            let fullDate = year + "-" + month + "-" + date + "-" + hour;
            ////////////end date/////
            let agreeStatuss = 1;
            const data = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phone: req.body.phone,
                email: req.body.email,
                role: role,
                password: hashed,
                address: req.body.address,
                // profilePicture:img_name,
                gender: req.body.gender,
                activationCode: code,
                passCode: passCodess,
                status: statuss,
                date: fullDate,
                agreeStatus: agreeStatuss
            }
            var rules = validationRules.sellers.create;
            var validator = new asyncValidator(rules);
            //////////////////////////////////////
            validator.validate(data, (errors, fields) => {
                if (!errors) {
                    userModel.createSeller(data, function (result) {//go to userModel.js in models folder and
                        //in this there is createuser()function to insert data to database.
                        if (result) {
                            ////////////////gmail sent/////
                            console.log(result);
                            ///////gmail sent///////////
                            // var nodemailer = require('nodemailer');
                            var linkss = "<a href='https://api.adimera.net/' target='_blank'>";
                            // var linkss = "<a href='http://192.168.1.12:3006/' target='_blank'>";
                            var transporter = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                    user: 'yemie008@gmail.com',
                                    pass: 'correctyear10'
                                }
                            });
                            var mailOptions = {
                                from: 'yemie008@gmail.com',//yemie008@gmail.com
                                to: data.email,
                                subject: 'Activation code to Reset Password.',
                                html: '<h1>Welcome</h1><p>This is the Activation code:</p>' + code + "<p>" + linkss + " click here to go to login page</a></p>",
                                // body:'this is the content of the data'
                                // text: "This is the Secure code:"+code

                            };
                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log('Email sent: ' + info.response);
                                }
                            });
                            ///////////////////end gmail sent///////////////
                            const expiresIn = 24 * 60 * 60;
                            const accessToken = jwt.sign({ user_id: result.user_id }, SECRET_KEY, {
                                expiresIn: expiresIn
                            });
                            res.status(200).json({ success: true, token: 'JWT ' + accessToken });
                        }
                        else {
                            // res.send('Invalid');
                            res.status(200).json({ 'errs': 'email duplicated credentials!.' });
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
            // });
            // }
        });
    });
    /////end brace for image/////////
});

// ////////////////add product photo /////
router.post('/productPhoto/:product_id', (req, res) => {
    ///////////////for image only////////////
    // Seconds
    let ts = Date.now();
    let date_ob = new Date(ts);
    var year = date_ob.getFullYear();
    var month = date_ob.getMonth() + 1;
    var date = date_ob.getDate();
    var second = date_ob.getMilliseconds();
    var monthss = "%" + year + "-" + month + "%";
    //  console.log("now months:"+monthss);
    if (!req.files)
        return res.status(400).send('No files were uploaded.');



    var file = req.files.product_image;
    let sss = file.name;
    console.log("name:" + sss)
    const imm = {
        imagenmm: file.name
    }
    console.log("file length:" + imm.length);
    ///////////if one image/////////////
    if (file.name) {
        console.log("image name:" + file.name)
        var img_name = file.name;
        console.log("all images:" + img_name)
        // console.log("image name:"+JSON.stringify(file.length))
        if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {

            file.mv('public/images/' + file.name, function (err) {
                if (err) return res.status(500).send("the errors were" + err);
                console.log("images of in:" + file.name);
                //////////////////end for image codes////////////
                // var user_id=req.params;
                var product_id = req.params.product_id;
                const data = {
                    product_id: product_id,
                    product_image: file.name
                }
                // data.product_image = img_name;

                // data.product_id=product_id;
                console.log("data images:" + data.product_image)
                var rules = validationRules.products.productPhoto;
                var validator = new asyncValidator(rules);
                validator.validate(data, (errors, fields) => {
                    if (!errors) {
                        productModel.productPhoto(data, function (result) {//go to userModel.js in models folder and
                            if (result) {
                                // console.log(result);
                                res.status(200).json({ success: true });
                                // res.redirect('/login');
                            }
                            else {
                                // res.send('Invalid');
                                res.status(200).json({ 'errs': 'Invalid Image!.' });
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
                // }//else image not folde loop
            });
        }
    }
    else {
        ///////////end if one image////////
        for (let i = 0; i < file.length; i++) {

            var img_name = file[i].name + "(" + second + ")";
            console.log("all images:" + img_name)
            // console.log("image name:"+JSON.stringify(file.length))
            if (file[i].mimetype == "image/jpeg" || file[i].mimetype == "image/png" || file[i].mimetype == "image/gif") {

                file[i].mv('public/images/' + file[i].name + "(" + second + ")", function (err) {
                    if (err) return res.status(500).send("the errors were" + err);
                    console.log("images of in:" + file[i].name + "(" + second + ")");
                    //////////////////end for image codes////////////
                    // var user_id=req.params;
                    var product_id = req.params.product_id;
                    const data = {
                        product_id: product_id,
                        product_image: file[i].name + "(" + second + ")"
                    }
                    var rules = validationRules.products.productPhoto;
                    var validator = new asyncValidator(rules);
                    validator.validate(data, (errors, fields) => {
                        if (!errors) {
                            productModel.productPhoto(data, function (result) {//go to userModel.js in models folder and
                                // }
                            });
                        }
                        else {
                            console.log(fields);
                            res.status(200).json({ 'errs': 'not validated!.' });
                            // res.render('signup', {errs: errors});
                        }
                    });
                    /////////start image brace
                    // }//else image not folde loop
                });
            }
        }
        res.status(200).json({ success: true });
    }//end else
    /////end brace for image/////////
});
/////////////end productPhoto///////
// ////////////////add product photo /////

// ////////////////edit product photo /////
router.post('/editproductPhoto/:id', (req, res) => {
    ///////////////for image only////////////
 console.log("edit back end section")
 console.log(req.files)

    

    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    var file = req.files.product_image;
    var img_name = file.name;

    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {

        file.mv('public/images/' + file.name, function (err) {

            if (err)
                return res.status(500).send("the errors were" + err);

            //////////////////end for image codes////////////
        
            var ids = req.params.id;
            const data = {product_image } = req.body;
              data.product_id=ids
            data.product_image = img_name;
            var ids = req.params.id;
            var rules = validationRules.products.productPhotoEdit;
            var validator = new asyncValidator(rules);
            validator.validate(data, (errors, fields) => {
                if (!errors) {
                    productModel.productPhotoEdit(ids, data, function (result) {//go to userModel.js in models folder and
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
/////////////end productPhoto edit///////
/////////show of that product photo//
router.get('/editProductPhoto/:id', (req, res) => {
    var product_id = req.params.id;
    productModel.getProductPhoto(product_id, (result) => {
        if (result.length == 0) {
            res.status(200).json({ 'productPhoto': result });
        }
        else {
            res.status(200).json({ 'productPhoto': result });
        }
    });
});
///////
router.get('/deleteProductPhoto/:id', (req, res) => {
    var id = req.params.id;
    // console.log("id"+id)
    ////////////////delete image//////////
    productModel.getProductPhoto(id, (resultIMG) => {
        var imageName = resultIMG.product_image;
        if (!imageName) {
            productModel.deleteProductPhoto(id, (result) => {
                if (result.length == 0) {
                    res.status(200).json({ 'ProductPhoto': 'Invalid' });
                }
                else {
                    // console.log(result);
                    res.status(200).json({ success: true });
                }
            });
        }
        else {
            var filePath = "public/images/" + imageName;
            fs.unlinkSync(filePath);
            ///////////////end delete image///////
            productModel.deleteProductPhoto(id, (result) => {
                if (result.length == 0) {
                    res.status(200).json({ 'ProductPhoto': 'Invalid' });
                }
                else {
                    // console.log(result);
                    res.status(200).json({ success: true });
                }
            });
        }
    });
});
///////end product photo delte///
/////////show all product photo//
router.get('/getAllProductPhoto', authorization.authenticateJWT, (req, res) => {
    productModel.getAllProductPhoto((result) => {
        if (!result) {
            res.status(200).json({ 'Photo': result });
        }
        else {
            // console.log(result);
            res.status(200).json({ 'productPhoto': result });
        }
    });
});
///////////end product photo///////////////
//////////user delete///
router.get('/deleteUsers/:id', (req, res) => {
    var id = req.params.id;
    userModel.deleteUser(id, (result) => {
        if (result.length == 0) {
            res.status(200).json({ 'User': 'Invalid' });
        }
        else {
            console.log(result);
            res.status(200).json({ success: true });
        }
    });
});
///////end user delte///
/////////show all users//
router.get('/getAllUsers', authorization.authenticateJWT, (req, res) => {
    // if(authorization.authenticateJWT)
    // {
    let role = 0;
    console.log("authorized" + authorization.authenticateJWT)
    userModel.getAllUser(role, (result) => {
        if (!result) {
            res.status(200).json({ 'User': result });
        }
        else {
            // console.log(result);
            // console.log(result);
            /////////////////////////////////
            var collectionss = [];
            result.forEach(element => {
                collectionss.push({
                    user_id: element.user_id,
                    firstName: element.firstName,
                    lastName: element.lastName,
                    phone: element.phone,
                    email: element.email,
                    role: element.role,
                    address: element.address,
                    profilePicture: element.profilePicture,
                    gender: element.gender,
                });
            });
            return res.status(200).json(collectionss);
            ///////////////////////////////////
        }
    });
    /////////////

});
///////////end ///////////////
////////////end of user//////////////

////////////start product//////////
router.post('/createProduct', (req, res) => {
    ///////////////for image only////////////
    //////////////////end for image codes////////////
    console.log(".............")
    console.log(req.body)
    console.log("..................")
    const Data=req.body
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hour = date_ob.getHours();
    let fullDate = year + "-" + month + "-" + date + "-" + hour;
    const data = { Category_id, Name, Description, Code, Price, Image, uploadedBy, date, color, size, quantity, totalRate } = req.body;
    data.date = fullDate;
    data.totalRate = 0
    data.Name = data.Name.toLowerCase();
    // console.log("all data:"+req.body.Name);
    // console.log("catagory:"+req.body.Category_id);
    var rules = validationRules.products.create;
    var validator = new asyncValidator(rules);
    validator.validate(data, (errors, fields) => {
        if (!errors) {

            delivery.createProduct(data, function (result) {//go to cartModel.js in models folder and
 
                console.log("product -id")
                console.log(result)

                if (result) {
                    productModel.getProductId(function (result1) {
                      
                    
                        console.log(" .........."+result1)
                        
                        ///////////////////////
                        if (result1) {
                            res.status(200).json({ success: true, 'data': result1 });
                            
                            packaging.createPackaging(result1,data.packaging,function(Result)
                            {
                                
                            })
                            

                          
                        }

                    });

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


    
    
    ///////start image brace
    
    
    /////end brace for image/////////



/////////show of that id//
router.get('/editProduct/:id', (req, res) => {
    var product_id = req.params.id;
    productModel.getProduct(product_id, (result) => {
        if (result.length == 0) {
            res.status(200).json({ 'User': result });
        }
        else {
            res.status(200).json({ 'User': result });
        }
    });

});
///////////end ///////////////

////////////////edit product/
router.post('/editProduct/:id', (req, res) => {
    // router.post('/create', (req, res) => {
      console.log(req.body)
      console.log("////================/////")
      

    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hour = date_ob.getHours();
    let fullDate = year + "-" + month + "-" + date + "-" + hour;
    const data = { Category_id, Name, Description, Code, Price, Image, uploadedBy, date, color, size, quantity } = req.body;
    // data.Image = img_name;
    data.Name = data.Name.toLowerCase();
    data.date = fullDate;
    var rules = validationRules.products.update;
    var id = req.params.id;
    var validator = new asyncValidator(rules);
    validator.validate(data, (errors, fields) => {
        if (!errors) {
            productModel.updateProduct(id, data, function (result) {//go to productModel.js in models folder and
                console.log("result........")
                console.log(result)

                if (result) {
                    // console.log(result);
                    res.status(200).json({ success: true });

                }
                else {

                    res.status(200).json({ 'errs': 'Invalid credentials!.' });
                }
            });
             var packageData=data.packaging
            
            packaging.editPackaging(id,packageData,function(result)
            {
                  console.log(result)
            })


        }
        else {
            // console.log(fields);
            res.status(200).json({ 'errs': 'not validated!.' });

        }
    });
});
/////////////end edit///////

//////////product delete///
router.get('/deleteProduct/:id', (req, res) => {
    var id = req.params.id;
  
    delivery.deleteDelivery(id, (result) => {
        if (result.length == 0) {
            res.status(200).json({ 'product': 'Invalid' });
        }
        else {
            console.log(result);
            res.status(200).json({ success: true });
        }
    });
    packaging.deletePackaging(id, (result) => {
        if (result.length == 0) {
            res.status(200).json({ 'product': 'Invalid' });
        }
        else {
            console.log(result);
            res.status(200).json({ success: true });
        }
    });
    productModel.deleteProduct(id, (result) => {
        if (result.length == 0) {
            res.status(200).json({ 'product': 'Invalid' });
        }
        else {
            console.log(result);
            res.status(200).json({ success: true });
        }
    });
});
///////end product delte///
/////////show all productss//
router.get('/getAllProducts', authorization.authenticateJWT, (req, res) => {
    productModel.getAllProductsssA((result) => {
        // console.log(result)
        // Name
        // firstName
        // lastName
        // uploadedBy
        // totalRate
        // id
        // color
        // orgin
        // age
        // Available
        // size
        // Code
        // Description
        // Price
        // quantity
        // Image
        // catagory_Name

        if (!result) {
            res.status(200).json({ 'product': result });
        }
        else {
            // console.log(result);
            res.status(200).json(result);
            // console.log(result)
        }
    });
});
///////////end ///////////////
////////////////end product/////////

////////////////catagory////////
router.post('/createCatagory', (req, res) => {
    ///////////////for image only////////////
    console.log(req.files)
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
    ////////////////delete image//////////
    catagoryModel.getCatagory(id, (resultIMG) => {
        var imageName = resultIMG.categoryImage;
        if (!imageName) {
            catagoryModel.deleteCatagory(id, (result) => {
                if (result.length == 0) {
                    res.status(200).json({ 'product': 'Invalid' });
                }
                else {
                    console.log(result);
                    res.status(200).json({ success: true });
                }
            });
            // res.status(200).json({ 'catgory': 'Invalid' });
        }
        else {
            var filePath = "public/images/" + imageName;
            fs.unlinkSync(filePath);
            ///////////////end delete image///////
            catagoryModel.deleteCatagory(id, (result) => {
                if (result.length == 0) {
                    res.status(200).json({ 'product': 'Invalid' });
                }
                else {
                    console.log(result);
                    res.status(200).json({ success: true });
                }
            });
        }
    });
});
///////end catagory delte///
/////////show all catagory//
router.get('/getAllCatagory', authorization.authenticateJWT, (req, res) => {
    catagoryModel.getAllCatagory((result) => {
        if (!result) {
            res.status(200).json(result);
        }
        else {
            res.status(200).json(result);
        }
    });
});
///////////end ///////////////
/////////////end catagory//////


//////////change password/////
router.post('/sentEmail', (req, res) => {
    const data = { email } = req.body
    var code = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
    data.activationCode = code;
    var rules = validationRules.users.sentEmail;
    var validator = new asyncValidator(rules);
    validator.validate(data, (errors, fields) => {
        if (!errors) {
            userModel.sentEmail(data, function (result) {//go to cartModel.js in models folder and

                if (result) {
                    ///////gmail start
                    var urlLink = "home.adimera.net"
                    console.log("url:" + req.protocol + req.get("host"));
                    // link = "http://" + req.get("host") + "/verify/" + code;
                    link = "https://" + urlLink + "/verify/" + code;
                    // var nodemailer = require('nodemailer');
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'yemie008@gmail.com',
                            pass: 'correctyear10'
                        }
                    });
                    var mailOptions = {
                        from: 'yemie008@gmail.com',//yemie008@gmail.com
                        to: data.email,
                        subject: 'Activation code to Reset Password.',
                        html: '<h1>Welcome</h1><p>This is the Activation code:</p>' + code + "<p><a href=''>click Here to activate</p>" + req.url,
                        // body:'this is the content of the data'
                        // text: "This is the Secure code:"+code

                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                    /////////end gmail
                    console.log(result);
                    res.status(200).json({ 'sent': 'Secure code is Sent to your Gmail successfuly!' });

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
////////////change passsword
router.post('/recoverPassword', (req, res) => {
    ////////////////////////////////////////
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash("password", salt, function (err, hash) {
            var hashed = hash;
            /////////////////////////////////////////
            const data = { email, newPassword, confirmPassword, activationCode, passCode } = req.body
            var rules = validationRules.users.changePassword;
            data.passCode = newPassword;
            var validator = new asyncValidator(rules);
            // ///////
            console.log(data.email);
            console.log(data.activationCode)
            console.log(data.newPassword);
            userModel.EmailExists(data, (result1) => {
                ///////
                console.log(result1.email);
                if (result1.length == 0) {
                    // console.log(result);
                    res.status(200).json({ incorrectCode: 'Incorrect Activation code!.' });
                }
                else if (result1) {
                    validator.validate(data, (errors, fields) => {
                        if (!errors) {
                            ///////
                            data.newPassword = hashed;
                            //////
                            userModel.updatePassword(data.email, data, function (result) {//go to cartModel.js in models folder and

                                if (result) {
                                    console.log(result);
                                    res.status(200).json({ 'password': 'password successfuly updated!' });

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
                }
                else {

                    res.status(200).json({ 'errs': 'No secure code and email!.' });
                }
                // callback(result[0]);
            });
            /////////hash/////
        });
    });
    /////end hash/////
});
//////////////////end change password
////////////change passsword
router.post('/changePassword', (req, res) => {
    ////////////////////////////////////////
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash("password", salt, function (err, hash) {
            var hashed = hash;
            /////////////////////////////////////////
            const data = { email, newPassword, currentPassword, passCode } = req.body
            var rules = validationRules.users.changePassword;
            data.passCode = newPassword;
            var validator = new asyncValidator(rules);
            userModel.passwordExists(data, (result1) => {
                ///////
                if (result1.length == 0) {
                    // console.log(result);
                    res.status(200).json({ 'CurrentPassword': 'Incorrect Current Password!.' });
                }
                // console.log(result1.passCode)
                else if (result1.length > 0) {
                    validator.validate(data, (errors, fields) => {
                        if (!errors) {
                            data.newPassword = hashed;
                            userModel.updatePassword(data.email, data, function (result) {//go to cartModel.js in models folder and

                                if (result) {
                                    console.log(result);
                                    res.status(200).json({ 'password': 'password successfuly updated!' });

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
                }
                else {

                    res.status(200).json({ 'errs': 'no current password created with this.' });
                }
                // callback(result[0]);
            });
            /////////hash/////
        });
    });
    /////end hash/////
});
//////////////////end change password
///////////////////sellers/////
router.get('/getAllSellers', authorization.authenticateJWT, (req, res) => {
    let role = 2;
    userModel.getAllSellers(role, (result) => {
        if (!result) {
            res.status(200).json({ 'seller': result });
        }
        else {
            console.log(result);
            res.status(200).json(result);
        }
    });
});
//////////seller delete///
router.get('/deleteSeller/:id', (req, res) => {
    var id = req.params.id;
    userModel.deleteUser(id, (result) => {
        if (result.length == 0) {
            res.status(200).json({ 'User': 'Invalid' });
        }
        else {
            console.log(result);
            res.status(200).json({ success: true });
        }
    });
});
//////////end delete seller////
////////////////edit seller////
router.post('/editSeller/:id', (req, res) => {
    ///////////////for image only////////////
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash("password", salt, function (err, hash) {
            var hashed = hash;
            ///////////////end/////////////////
            var code = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
            // data.activationCode=code;
            statuss = 1;
            let passCodess = req.body.password;
            // console.log("lastNameeeee:"+req.body.lastName);
            /////////////date/////////
            let ts = Date.now();
            let date_ob = new Date(ts);
            let date = date_ob.getDate();
            let month = date_ob.getMonth() + 1;
            let year = date_ob.getFullYear();
            let hour = date_ob.getHours();
            let fullDate = year + "-" + month + "-" + date + "-" + hour;
            let agreeStatuss = 1;
            ////////////end date/////
            const data = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phone: req.body.phone,
                email: req.body.email,
                role: req.body.role,
                password: hashed,
                address: req.body.address,
                // profilePicture: img_name,
                gender: req.body.gender,
                activationCode: code,
                passCode: passCodess,
                status: statuss,
                date: fullDate,
                agreeStatus: agreeStatuss
            }
            var seller_id = req.params.id;
            var rules = validationRules.sellers.update;
            var validator = new asyncValidator(rules);
            validator.validate(data, (errors, fields) => {
                if (!errors) {
                    userModel.updateUser(seller_id, data, function (result) {//go to userModel.js in models folder and
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
            // });
            // }
        });
    });
    /////end brace for image/////////
});
/////////////end edit///////
////////////////coupons start////////////
router.post('/createTestimonial', (req, res) => {
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hour = date_ob.getHours();
    // var codes = (Math.floor(Math.random() * 100000) + 100000)
    let fullDate = year + "-" + month + "-" + date + "-" + hour;
    const data = { name, message, date } = req.body;
    data.date = fullDate;
    var rules = validationRules.testimonial.create;
    var validator = new asyncValidator(rules);
    validator.validate(data, (errors, fields) => {
        if (!errors) {
            userModel.createTestimonial(data, function (result) {//go to userModel.js in models folder and

                if (result) {
                    // console.log(result);
                    res.status(200).json({ success: true });

                }
                else {

                    res.status(200).json({ 'errs': 'Invalid credentials!.' });
                }
            });
        }
        else {
            // console.log(fields);
            res.status(200).json({ 'errs': 'not validated!.' });

        }
    });
});

////////////////edit coupon/
router.post('/editTestimonial/:id', (req, res) => {
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hour = date_ob.getHours();
    // var codes = (Math.floor(Math.random() * 100000) + 100000)
    let fullDate = year + "-" + month + "-" + date + "-" + hour;
    const data = { name, message, date } = req.body;
    data.date = fullDate;
    var rules = validationRules.testimonial.update;
    var id = req.params.id;
    var validator = new asyncValidator(rules);
    validator.validate(data, (errors, fields) => {
        if (!errors) {
            userModel.updateTestimonial(id, data, function (result) {//go to userModel.js in models folder and

                if (result) {
                    // console.log(result);
                    res.status(200).json({ success: true });

                }
                else {

                    res.status(200).json({ 'errs': 'Invalid credentials!.' });
                }
            });
        }
        else {
            // console.log(fields);
            res.status(200).json({ 'errs': 'not validated!.' });

        }
    });
});

/////////show all coupon//
// authorization.authenticateJWT
router.get('/getAllTestimonial', (req, res) => {
    // var coupons=req.params.coupon;
    userModel.getAllTestimonial((result) => {
        if (!result) {
            res.status(200).json({ 'result': result });
        }
        else {
            // console.log(result);
            res.status(200).json({ 'result': result });
        }
    });
});
router.get('/deleteTestimonial/:id', (req, res) => {
    var id = req.params.id;
    userModel.deleteTestimonial(id, (result) => {
        if (result.length == 0) {
            res.status(200).json({ 'product': 'Invalid' });
        }
        else {
            // console.log(result);
            res.status(200).json({ success: true });
        }
    });
});
router.get('/getSubCategory/:id', (req, res) => {
    var categoryID = req.params.id;
    catagoryModel.getSubCategory(categoryID, (result) => {
        if (result.length == 0) {
            res.status(200).json(result);
        }
        else {
            // console.log(result);
            res.status(200).json(result);
        }
    });
});
router.get('/getAllSubCategory', authorization.authenticateJWT, (req, res) => {
    // var categoryID = req.params.id;
    catagoryModel.getAllSubCategory((result) => {
        if (result.length == 0) {
            res.status(200).json(result);
        }
        else {
            // console.log(result);
            res.status(200).json(result);
        }
    });
});
router.get("/getSingleCatagory/:id", (req, res) => {//backup
    var ids = req.params.id;
    catagoryModel.getCatagory(ids, (result) => {
        if (!result) {
            res.status(200).json({ catagory: result });
        } else {
            // console.log(result);
            res.status(200).json({ catagory: result });
        }
    });
});
router.get("/getAllChats", (req, res) => {//backup
    userChatModel.getAllChats((result) => {
        if (!result) {
            res.status(200).json({ result });
        } else {
            // console.log(result);
            res.status(200).json({ result });
        }
    });
});
module.exports = router;
