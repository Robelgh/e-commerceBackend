var express = require("express");
var router = express.Router(); //handles routing paths
var nodemailer = require("nodemailer");
var userModel = require("../models/userModel");
var cartModel = require("../models/cartModel");
var catagoryModel = require("../models/catagoryModel");
var productModel = require("../models/productModel");
var wishlistModel = require("../models/WishlistModel");
var validationRules = require("../validation_rules/rules");
var asyncValidator = require("async-validator-2");
var db = require("../models/config");
var authorization = require('../middlewares/authorization');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const SECRET_KEY = "secretkey23456";
var code, host, link;
var fs = require('fs');
const uuid = require("uuid");
router.post("/registerUsers", (req, res) => {
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash("password", salt, function (err, hash) {
      var hashed = hash;
      //   console.log(hashed)

      ///////////////end/////////////////
      var code = (Math.floor(Math.random() * 10000) + 10000)
        .toString()
        .substring(1);
      // data.activationCode=code;
      let statuss = 0;
      let passCodess = req.body.password;
      let roles = 0;
      /////////////date/////////
      let ts = Date.now();
      let date_ob = new Date(ts);
      let date = date_ob.getDate();
      let month = date_ob.getMonth() + 1;
      let year = date_ob.getFullYear();
      let hour = date_ob.getHours();
      let fullDate = year + "-" + month + "-" + date + "-" + hour;
      ////////////end date/////
      const data = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        email: req.body.email,
        role: roles,
        password: hashed,
        address: req.body.address,
        activationCode: code,
        passCode: passCodess,
        status: statuss,
        date: fullDate,
        agreeStatus: req.body.agreeStatus
      };
      var rules = validationRules.users.create;
      var validator = new asyncValidator(rules);
      //////////////////////////////////////
      validator.validate(data, (errors, fields) => {
        if (!errors) {
          userModel.createUser(data, function (result) {
            //go to userModel.js in models folder and
            //in this there is createuser()function to insert data to database.
            if (result) {
              ////////////////gmail sent/////
              console.log(result);
              host = req.get("host");
              var urlLink = "adimera.net/#/"
              console.log("url:" + req.protocol + req.get("host"));
              link = "https://" + urlLink + "verify/" + code;
              console.log(link)
              var transporter = nodemailer.createTransport({
                /////optional////
                host: "api.adimera.net",
                port: 465,
                secure: true,
                /////end optional/////
                //if it is on cpanel create email in cpanel and secure:true and delete service :gmail becuse it uses it's own gmail service
                auth: {
                  user: "verify@api.adimera.net",
                  pass: "se(GHVKNhf99",
                },
              });
              var mailOptions = {
                from: "verify@api.adimera.net",
                to: data.email,
                subject: "Email verification.",
                html:
                  "<h1>Welcome</h1><br> Please Click on the link to verify your email.<br><a href=" +
                  link +
                  ">Click here to verify</a>",
              };
              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log("Email sent: " + info.response);
                }
              });
              ///////////////////end gmail sent///////////////
              // console.log(result);
              // res.status(200).json({ 'sent': 'Secure code is Sent to your Gmail successfuly!' });
              /////start gmail sent//////
              // sess = req.session;
              // sess.email = result.email;
              // req.session.admin = result.firstName; //put user_id in a session.
              const expiresIn = 24 * 60 * 60;
              const accessToken = jwt.sign(
                { user_id: result.user_id },
                SECRET_KEY,
                {
                  expiresIn: expiresIn,
                }
              );
              res.status(200).json({ success: true, token: accessToken });
              ///end token////
            } else {
              // res.send('Invalid');
              res.status(200).json({ errs: "email duplicated credentials!." });
            }
          });
        } else {
          console.log(fields);
          res.status(200).json({ errs: "not validated!." });
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
/////////////verify email///////////
router.get("/verify/:code", function (req, res) {
  console.log(req.protocol + ":/" + req.get("host"));
  // if (req.protocol + "://" + req.get("host") == "http://" + host) {
  console.log("Domain is matched. Information is from Authentic email");
  var codes = req.params.code;
  userModel.getCodes(codes, (result) => {
    if (!result) {
      res.status(200).json({ Notverified: "email not verified!." });
    } else {
      // sess = req.session;
      // sess.email = result.email;
      ////////update  status/////
      var status = 1;
      // console.log("verified email:" + sess.email);
      userModel.updateStatus(status, codes, (result) => {
        if (result) {
          res.status(200).json({ verify: "email is verified!" });
        }
        // else {
        //     res.status(200).json({ 'verify': 'email is verified!' });
        // }
      });
      //////end update status////
      // res.status(200).json({ 'verify': 'email is verified!' });
    }
  });
  // } else {
  //   // res.end("<h1>Request is from unknown source");
  //   res.status(200).json({ unknown: "Request is from unknown source" });
  // }
});
/////////////end verify email///////
/////////show ser of that id//
router.get("/edit/:id", (req, res) => {
  var user_id = req.params.id;
  userModel.getUser(user_id, (result) => {
    if (result.length == 0) {
      res.status(200).json({ User: "No Data!" });
    } else {
      res.status(200).json({ User: result });
    }
  });
});
///////////end ///////////////

////////////////edit user/
////////////////edit seller////
router.post("/editUser/:id", (req, res) => {
  ///////////////for image only////////////
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash("password", salt, function (err, hash) {
      var hashed = hash;
      ///////////////end/////////////////
      var code = (Math.floor(Math.random() * 10000) + 10000)
        .toString()
        .substring(1);
      // data.activationCode=code;
      statuss = 0;
      let passCodess = req.body.password;
      // console.log("lastNameeeee:" + req.body.lastName);
      /////////////date/////////
      let ts = Date.now();
      let date_ob = new Date(ts);
      let date = date_ob.getDate();
      let month = date_ob.getMonth() + 1;
      let year = date_ob.getFullYear();
      let hour = date_ob.getHours();
      let fullDate = year + "-" + month + "-" + date + "-" + hour;
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
        agreeStatus: req.body.agreeStatus
      };
      var user_id = req.params.id;
      var rules = validationRules.sellers.update;
      var validator = new asyncValidator(rules);
      validator.validate(data, (errors, fields) => {
        if (!errors) {
          userModel.updateUser(user_id, data, function (result) {
            //go to userModel.js in models folder and
            //in this there is createuser()function to insert data to database.
            if (result) {
              console.log(result);
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
      // });
      // }
    });
  });
  /////end brace for image/////////
});
/////////////end edit///////

//////////user delete///
router.get("/delete/:id", (req, res) => {
  var id = req.params.id;
  userModel.deleteUser(id, (result) => {
    if (result.length == 0) {
      res.status(200).json({ User: "Invalid" });
    } else {
      console.log(result);
      res.status(200).json({ User: "User Completely Deleted!" });
    }
  });
});
///////end user delte///
/////////show all users//
router.get("/getAllUsers", (req, res) => {
  let role = 0;
  userModel.getAllUser(role, (result) => {
    if (!result) {
      res.status(200).json({ User: result });
    } else {
      // console.log(result);
      ////////////////
      var collectionss = [];
      result.forEach((element) => {
        collectionss.push({
          user_id: element.user_id,
          firstName: element.firstName,
          lastName: element.lastName,
          phone: element.phone,
          email: element.email,
          status: element.status,
          password: element.password,
          address: element.address,
          profilePicture: element.profilePicture,
          gender: element.gender,
        });
      });
      return res.status(200).json({ users: collectionss });
      ////////////////////
      // res.status(200).json({ 'User': result });
    }
  });
});
///////////end ///////////////
////////////////cart////////
router.post("/createOrder", (req, res) => {
  for (let i = 0; i < req.body.length; i++) {
    let allData = JSON.stringify(req.body[i].user_id);
    var prsize = JSON.stringify(req.body[i].selectedSize);
    var prcolor = JSON.stringify(req.body[i].selectedColor);
    const data = {
      product_id: JSON.stringify(req.body[i].product_id),
      user_id: JSON.stringify(req.body[i].user_id),
      quantity: JSON.stringify(req.body[i].quantity),
      selectedSize: prsize,
      selectedColor: prcolor,
      // selectedSize: prsize.substring(1,prsize.length-1),
      // selectedColor: prcolor.substring(1,prcolor.length-1),
      //  totalPrice } = JSON.stringify(req.body[i]);
    };
    // console.log("singleData:"+data.product_id,"usid:"+data.user_id,data.selectedColor,data.selectedColor)
    /////////end loop//////
    var rules = validationRules.cart.create;
    var validator = new asyncValidator(rules);
    validator.validate(data, (errors, fields) => {
      if (!errors) {
        data.selectedSize = data.selectedSize.substring(1, prsize.length - 1)
        data.selectedColor = data.selectedColor.substring(1, prcolor.length - 1)
        //////////delete the previos cart of that id//
        cartModel.deleteAllCart(data, function (result) {
          //go to cartModel.js in models folder and
          if (result) {
            cartModel.createOrder(data, function (result) {
              //go to cartModel.js in models folder and
            });
            // cartModel.createOrder(data, function (result) {
            //   //go to cartModel.js in models folder and
            // });
          }
          else {
            cartModel.createOrder(data, function (resultp) {
              //go to cartModel.js in models folder and
              // global.Gresult=resultp[0].user_id;
            });
            // res.status(200).json({ errs: "User Not Exist!." });
          }
        });
        //////////////end delete//////////////////////

        // /insert to the history table//
        cartModel.createHistory(data, function (result1) {
          //go to cartModel.js in models folder and
        });
        ////////////////////end ////////
      } else {
        console.log(fields);
        res.status(200).json({ errs: "not validated!." });
      }
    });
    ////array for barace start//
  }
  // console.log("global data:"+Gresult)
  res.status(200).json({ success: true });
  /////end array for brace///
});
/////////show of that id//
router.get("/getCarts/:user_id", (req, res) => {
  var user_id = req.params.user_id;
  cartModel.getCart(user_id, (result) => {
    if (result.length == 0) {
      res.status(200).json({ User: result });
    } else {
      res.status(200).json({ User: result });
    }
  });
});
///////////end ///////////////

////////////////edit cart/
router.post("/editCart/:id", (req, res) => {
  const data = { product_id, user_id, quantity, selectedSize, selectedColor } = req.body;
  var rules = validationRules.cart.update;
  var cart_id = req.params.id;
  var validator = new asyncValidator(rules);
  validator.validate(data, (errors, fields) => {
    if (!errors) {
      cartModel.updateCart(cart_id, data, function (result) {
        //go to cartModel.js in models folder and

        if (result) {
          // console.log(result);
          res.status(200).json({ Catagory: "cart successfuly updated!" });
        } else {
          res.status(200).json({ errs: "Invalid credentials!." });
        }
      });
    } else {
      // console.log(fields);
      res.status(200).json({ errs: "not validated!." });
    }
  });
});
/////////////end edit///////

//////////cart delete///
router.get("/deleteCart/:id", (req, res) => {
  var id = req.params.id;
  cartModel.deleteCart(id, (result) => {
    if (result.length == 0) {
      res.status(200).json({ cart: result });
    } else {
      console.log(result);
      res.status(200).json({ cart: "cart Completely Deleted!" });
    }
  });
});
///////end cart delte///
/////////show all cart//
router.get("/getAllCart", (req, res) => {
  cartModel.getAllCart((result) => {
    if (!result) {
      res.status(200).json({ cart: result });
    } else {
      console.log(result);
      res.status(200).json({ carts: result });
    }
  });
});
///////////////delete all carts///////
router.get("/deleteAllCart", (req, res) => {
  cartModel.deleteAllCart((result) => {
    if (!result) {
      res.status(200).json({ cart: "No data!" });
    } else {
      console.log(result);
      res.status(200).json({ cart: "All carts are Deleted completely." });
    }
  });
});
///////////end ///////////////
/////////////end cart//////
////////////////cart////////
router.post('/createWishlist', (req, res) => {
  for (let i = 0; i < req.body.length; i++) {
    console.log("arrayData:" + JSON.stringify(req.body[i]));
    // let allData=JSON.stringify(req.body[i].user_id);
    const data = {
      product_id: JSON.stringify(req.body[i].product_id),
      user_id: JSON.stringify(req.body[i].user_id)
      //  quantity:JSON.stringify(req.body[i].quantity)
      //  totalPrice } = JSON.stringify(req.body[i]);
    }
    /////////end loop//////
    var rules = validationRules.wishlist.create;
    var validator = new asyncValidator(rules);
    validator.validate(data, (errors, fields) => {
      if (!errors) {
        ////////////////
        wishlistModel.deleteAllWishlist(data, function (result) {
          //go to cartModel.js in models folder and
          if (result) {
            wishlistModel.createWishlist(data, function (result) {//go to cartModel.js in models folder and
            });
          }
          else {
            res.status(200).json({ errs: "User Not Exist!." });
          }
        });
        ////////////////
        // wishlistModel.createWishlist(data, function (result) {//go to cartModel.js in models folder and
        // });
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
router.get("/getWishlist/:id", (req, res) => {
  var Wishlist_id = req.params.id;
  wishlistModel.getWishlist(Wishlist_id, (result) => {
    if (result.length == 0) {
      res.status(200).json({ Wishlist: result });
    } else {
      res.status(200).json({ Wishlist: result });
    }
  });
});
///////////end ///////////////

////////////////edit wilshit/
router.post("/editWishlist/:id", (req, res) => {
  const data = { product_id, user_id, quantity } = req.body
  // sess = req.session; //start the session
  // var sessionId = sess.user_id;
  // const data = {
  //   product_id: req.body.product_id,
  //   user_id: sessionId,
  //   quantity: req.body.quantity,
  // };
  var rules = validationRules.wishlist.update;
  var Wishlist_id = req.params.id;
  var validator = new asyncValidator(rules);
  validator.validate(data, (errors, fields) => {
    if (!errors) {
      wishlistModel.updateWishlist(Wishlist_id, data, function (result) {
        //go to wishlistModel.js in models folder and

        if (result) {
          console.log(result);
          res.status(200).json({ Wishlist: "Wishlist successfuly updated!" });
        } else {
          res.status(200).json({ errs: "Invalid credentials!." });
        }
      });
    } else {
      console.log(fields);
      res.status(200).json({ errs: "not validated!." });
    }
  });
});
/////////////end edit///////

//////////wilshit delete///
router.get("/deleteWishlist/:id", (req, res) => {
  var id = req.params.id;
  wishlistModel.deleteWishlist(id, (result) => {
    if (result.length == 0) {
      res.status(200).json({ Wishlist: "Invalid" });
    } else {
      console.log(result);
      res.status(200).json({ Wishlist: "Wishlist Completely Deleted!" });
    }
  });
});
///////end cart delte///
/////////show all wishlist//
router.get("/getAllWishlist", (req, res) => {
  wishlistModel.getAllWishlist((result) => {
    if (!result) {
      res.status(200).json({ cart: result });
    } else {
      console.log(result);
      res.status(200).json({ cart: result });
    }
  });
});
/////////////end cart//////
////////////slip///
////////////////cart////////
router.post("/createSlip", (req, res) => {
  // const data = { productName,UserName,productPrice,quantity,vate} = req.body
  ////////////////
  let ts = Date.now();
  let date_ob = new Date(ts);
  let date = date_ob.getDate();
  let month = date_ob.getMonth() + 1;
  let year = date_ob.getFullYear();
  let hour = date_ob.getHours();
  let fullDate = year + "-" + month + "-" + date + "-" + hour;
  // sess = req.session; //start the session
  // var sessionEmails = sess.email;
  const data = {
    productName: req.body.productName,
    UserName: req.body.UserName,
    date: fullDate,
    productPrice: req.body.productPrice,
    quantity: req.body.productPrice,
    vate: req.body.quantity,
    // email: sessionEmails,
    email:req.body.email,
    date: fullDate,
  };
  /////////////////
  var rules = validationRules.slip.create;
  /////////current date///////////
  var validator = new asyncValidator(rules);
  validator.validate(data, (errors, fields) => {
    if (!errors) {
      cartModel.createSlip(data, function (result) {
        //go to cartModel.js in models folder and

        if (result) {
          console.log(result);
          res.status(200).json({ createSlip: "Slip successfuly registered!" });
        } else {
          res.status(200).json({ errs: "Invalid credentials!." });
        }
      });
    } else {
      console.log(fields);
      res.status(200).json({ errs: "not validated!." });
    }
  });
});
//////////select all slips//
/////////show all cart//
router.get("/getAllSlips", (req, res) => {
  // sess = req.session; //start the session
  // var sessionEmails = sess.email;
  var email=req.body.email;
  cartModel.getAllSlips(email, (result) => {
    if (!result) {
      res.status(200).json({ slips: "No data!" });
    } else {
      res.status(200).json({ slips: result });
    }
  });
});
////////end slip////////////

// ////////////////add product photo /////
router.post("/productPhoto", (req, res) => {
  ///////////////for image only////////////

  if (!req.files) return res.status(400).send("No files were uploaded.");

  var file = req.files.product_image;
  var img_name = file.name;

  if (
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/png" ||
    file.mimetype == "image/gif"
  ) {
    file.mv("public/images/" + file.name, function (err) {
      if (err) return res.status(500).send("the errors were" + err);

      //////////////////end for image codes////////////
      // var user_id=req.params;
      const data = ({ product_id, product_image } = req.body);
      data.product_image = img_name;
      // var user_id = req.params.id;
      var rules = validationRules.products.productPhoto;
      var validator = new asyncValidator(rules);
      validator.validate(data, (errors, fields) => {
        if (!errors) {
          productModel.productPhoto(data, function (result) {
            //go to userModel.js in models folder and
            //in this there is createuser()function to insert data to database.
            if (result) {
              console.log(result);
              res
                .status(200)
                .json({ product: "product successfuly registered!" });
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
});
/////////////end productPhoto///////
// ////////////////edit product photo /////
router.post("/editproductPhoto/:id", (req, res) => {
  ///////////////for image only////////////

  if (!req.files) return res.status(400).send("No files were uploaded.");

  var file = req.files.product_image;
  var img_name = file.name;

  if (
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/png" ||
    file.mimetype == "image/gif"
  ) {
    file.mv("public/images/" + file.name, function (err) {
      if (err) return res.status(500).send("the errors were" + err);

      //////////////////end for image codes////////////
      const data = ({ product_id, product_image } = req.body);
      data.product_image = img_name;
      var ids = req.params.id;
      var rules = validationRules.products.productPhotoEdit;
      var validator = new asyncValidator(rules);
      validator.validate(data, (errors, fields) => {
        if (!errors) {
          productModel.productPhotoEdit(ids, data, function (result) {
            //go to userModel.js in models folder and
            //in this there is createuser()function to insert data to database.
            if (result) {
              console.log(result);
              res.status(200).json({ product: "product successfuly updated!" });
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
});
/////////////end productPhoto edit///////
/////////show of that product photo//
router.get("/editProductPhoto/:id", (req, res) => {
  var product_id = req.params.id;
  productModel.getProductPhoto(product_id, (result) => {
    if (result.length == 0) {
      res.status(200).json({ productPhoto: "No Data!" });
    } else {
      res.status(200).json({ productPhoto: result });
    }
  });
});
///////
router.get("/deleteProductPhoto/:id", (req, res) => {
  var id = req.params.id;
  productModel.deleteProductPhoto(id, (result) => {
    if (result.length == 0) {
      res.status(200).json({ ProductPhoto: "Invalid" });
    } else {
      console.log(result);
      res.status(200).json({ productPhoto: "product Completely Deleted!" });
    }
  });
});
///////end product photo delte///
/////////show all product photo//
router.get("/getAllProductPhoto", (req, res) => {
  productModel.getAllProductPhoto((result) => {
    if (!result) {
      res.status(200).json({ Photo: result });
    } else {
      // console.log(result);
      res.status(200).json({ productPhoto: result });
    }
  });
});
///////////end product photo///////////////
////////////////catagory////////

/////////show of that id//

router.get("/catagoryProductsBySub/:id", (req, res) => {
  var catagory_id = req.params.id;
  catagoryModel.catagoryProducts(catagory_id, (result) => {
    if (result.length == 0) {
      res.status(200).json({ products: "No Data!" });
    } else {
      res.status(200).json({ products: result });
    }
  });
});
router.get("/catagoryProducts/:id", (req, res) => {//subcatatogory added for catagoryProducts
  var catagory_id = req.params.id;
  /////////////////make dynamic for subcatagory table/////////////
  var sql = "DELETE FROM subcategory";
  db.executeQuery(sql, [null], function (resultd) {
    // callback(result);
  });
  ///////////////////end dynamic catagory table///////////////////
  ///////////insert to subcatatgory table////////////
  ///////////one insertion///
  var sql = "SELECT * FROM category WHERE id = ?";
  db.executeQuery(sql, [catagory_id], function (result2) {
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
  db.executeQuery(sql, [catagory_id], function (result3) {
    if (result3.length == 0) {
      catagoryModel.catagoryProducts(catagory_id, (result) => {
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
});
///////////end ///////////////

////////////////edit catagory/
router.post("/editCatagory/:id", (req, res) => {
  const data = ({ Name, Description } = req.body);
  var rules = validationRules.catagory.update;
  var catagory_id = req.params.id;
  var validator = new asyncValidator(rules);
  validator.validate(data, (errors, fields) => {
    if (!errors) {
      catagoryModel.updateCatagory(catagory_id, data, function (result) {
        //go to catagoryModel.js in models folder and

        if (result) {
          console.log(result);
          res.status(200).json({ Catagory: "Catagory successfuly updated!" });
        } else {
          res.status(200).json({ errs: "Invalid credentials!." });
        }
      });
    } else {
      console.log(fields);
      res.status(200).json({ errs: "not validated!." });
    }
  });
});
/////////////end edit///////

//////////catagory delete///
router.get("/deleteCatagory/:id", (req, res) => {
  var id = req.params.id;
  catagoryModel.deleteCatagory(id, (result) => {
    if (result.length == 0) {
      res.status(200).json({ catagory: "Invalid" });
    } else {
      // console.log(result);
      res.status(200).json({ catagory: "catagory Completely Deleted!" });
    }
  });
});
///////end catagory delte///
/////////show all catagory//
router.get("/getAllCatagory", (req, res) => {
  catagoryModel.getAllCatagory((result) => {
    if (!result) {
      res.status(200).json({ catagory: result });
    } else {
      // console.log(result);
      res.status(200).json({ catagory: result });
    }
  });
});
///////////end ///////////////
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
router.get("/getSingleCatagorySub/:id", (req, res) => {//subcatagory selection of the above
  var ids = req.params.id;
  var sql = "SELECT * FROM category WHERE parent= ?";
  db.executeQuery(sql, [ids], function (result3) {
    if (result3.length == 0) {
      catagoryModel.getCatagory(ids, (result) => {
        if (!result) {
          res.status(200).json({ catagory: result });
        } else {
          // console.log(result);
          res.status(200).json({ catagory: result });
        }
      });
    }
    else {
      res.status(200).json({ catagory: result3 });
    }/////
  });
})
/////////////end catagory//////
/////////show all productss//
router.get("/getAllProducts/:pageNum", (req, res) => {
  var page = req.params.pageNum;
  var NumPages = page * 50;
  console.log(NumPages);
  productModel.getUserProducts(NumPages, (result) => {
    if (!result) {
      res.status(200).json({ product: result });
    } else {
      var collectionss = [];
      result.forEach((element) => {
        collectionss.push({
          id: element.id,
          Category_id: element.Category_id,
          Name: element.Name,
          Description: element.Description,
          Price: element.Price,
          quantity: element.quantity,
          color: element.color,
          size: element.size,
          totalRate: element.totalRate

        });
      });
      return res.status(200).json({ products: collectionss });
    }
  });
});
router.get("/productBySubCatagory/:catagoryName", (req, res) => {
  var catagoryNames = req.params.catagoryName;
  productModel.productByCatagory(catagoryNames, (result) => {
    if (!result) {
      res.status(200).json({ products: result });
    } else {
      // console.log(result);
      res.status(200).json({ products: result });
    }
  });
});
///////////end ///////////////
///////////////get sub catagory of products/////////
router.get("/productByCatagory/:catagoryName", (req, res) => {//subcatagory of above
  var catagoryNames = req.params.catagoryName;
  console.log("catagory name:" + catagoryNames)
  productModel.productBySubCatagory(catagoryNames, (result) => {
    if (!result) {
      res.status(200).json({ products: result });
    } else {
      /////////////////make dynamic for subcatagory table/////////////
      var sql = "DELETE FROM subcategory";
      db.executeQuery(sql, [null], function (resultd) {
        // callback(result);
      });
      ///////////////////end dynamic catagory table///////////////////
      var sql = "SELECT * FROM category WHERE catagory_Name LIKE ?";
      db.executeQuery(sql, [catagoryNames], function (result2) {
        if (result2.length == 0) {
          res.status(200).json({ products: result2 });
        }
        else {
          var catagoryID = result2[0].id
          console.log("catagoryID:" + catagoryID)
          ///////////insert to subcatatgory table////////////
          ///////////one insertion///
          var catagory_Names = result2[0].catagory_Name
          var parents = result2[0].parent;
          var sql = "INSERT INTO  subcategory VALUES(null, ?, ?, ?)";
          db.executeQuery(
            sql,
            [
              catagory_Names,
              parents,
              catagoryID
            ],
            function (result) {
              // callback(result);
            }
          );
          ////////////one isertion////
          var sql = "SELECT * FROM category WHERE parent= ?";
          db.executeQuery(sql, [catagoryID], function (result3) {
            if (result3.length == 0) {
              var sql =
                "SELECT  product.Name,product.uploadedBy,product.totalRate,product.quantity,product.Category_id, product.id, product.Code,product.Description,product.color, product.size, product.Price, product.Image,category.catagory_Name,category.parent FROM product LEFT JOIN category ON product.Category_id = category.id WHERE category.catagory_Name = ? AND product.quantity >0 ORDER BY product.id DESC";
              db.executeQuery(sql, [catagoryNames], function (resultn) {
                res.status(200).json({ products: resultn });
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
        }
      })
    }
  });
});
///////////////get subcatagory products////////////
/////////show ser of that id//
router.get("/searchProductsSub/:name", (req, res) => {
  var pid = req.params.name;
  var productName = "%" + pid.substring(0, 3).toLowerCase() + "%";
  console.log("the substring is:" + productName);
  productModel.searchProductsByCategory(productName, (resultc) => {
    if (!resultc) {
      /////////////to search products by productname or productname////////////
      productModel.searchProductsName(productName, (resultc2) => {
        res.status(200).json({ products: resultc2 });
        /////////////////end search products by product name or productname////////////

      });
    } else {
      /////////////to search products by catagory id or productname////////////
      var cID = resultc.id;
      // productModel.searchProducts(cID,(result) => {
      productModel.searchProducts(productName, cID, (result) => {
        res.status(200).json({ products: result });
        // }
      });
      /////////////end to search products by catagory id or productname////////////
    }
  });

});
router.get("/searchProducts/:name", (req, res) => {//sub of search products
  var pid = req.params.name;
  var productName = "%" + pid.substring(0, 3).toLowerCase() + "%";
  console.log("the substring is:" + productName);
  productModel.searchProductsByCategory(productName, (resultc) => {
    if (!resultc) {
      /////////////to search products by productname or productname////////////
      productModel.searchProductsName(productName, (resultc2) => {
        res.status(200).json({ products: resultc2 });
        /////////////////end search products by product name or productname////////////

      });
    } else {
      /////////////to search products by catagory id or productname////////////
      var cID = resultc.id;
      /////////////////make dynamic for subcatagory table/////////////
      var sql = "DELETE FROM subcategory";
      db.executeQuery(sql, [null], function (resultd) {
        // callback(result);
      });
      ///////////////////end dynamic catagory table///////////////////
      var sql = "SELECT * FROM category WHERE id = ?";
      db.executeQuery(sql, [cID], function (result2) {
        var catagoryID = result2[0].id
        console.log("catagoryID:" + catagoryID)
        ///////////insert to subcatatgory table////////////
        ///////////one insertion///
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
      db.executeQuery(sql, [cID], function (result3) {
        if (result3.length == 0) {
          // productModel.searchProducts(cID,(result) => {
          productModel.searchProducts(productName, cID, (result) => {
            res.status(200).json({ products: result });
            // }
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
            "SELECT  product.Name,product.uploadedBy,product.totalRate,product.quantity,product.Category_id, product.id, product.Code,product.Description,product.color, product.size, product.Price, product.Image,subcategory.catagory_Name,subcategory.parent FROM product LEFT JOIN subcategory ON product.Category_id = subcategory.catagory_id WHERE product.quantity >0 ORDER BY product.id DESC";
          db.executeQuery(sql, [null], function (result1) {
            // callback(result);
            res.status(200).json({ products: result1 });
          });
        }/////
      });
      // })
      /////////////end to search products by catagory id or productname////////////
    }
  });

});
router.get("/searchProductsByCategory/:name", (req, res) => {
  // var user_id = "%" + req.params.name;
  var pid = req.params.name;
  // var c1 = pid.charAt(0);
  // console.log(c1);
  var productName = "%" + pid.substring(0, 2).toLowerCase() + "%";
  // console.log("the substring is:"+str);
  productModel.searchProductsByCategory(productName, (result) => {
    if (result.length == 0) {
      //////////added////////
      res.status(200).json({ products: result });
    } else {

      res.status(200).json({ products: result });
    }
  });
});
/////////show products by catagory//
///////////////////product images/////
router.get("/getProductImages/:pid", (req, res) => {
  var product_id = req.params.pid;
  productModel.getProductImages(product_id, (result) => {
    if (!result) {
      res.status(200).json({ ProductImages: result });
    } else {
      // console.log(result);
      res.status(200).json({ productImages: result });
    }
  });
});
////////////try//
router.post("/getAllCart", (req, res) => {
  var user_ids = req.body.user_id;
  cartModel.getAllCarts(user_ids, (result) => {
    if (!result) {
      res.status(200).json({ ProductImages: result });
    } else {
      console.log(result.length);
      res.status(200).json({ productImages: result });
    }
  });
});
///////////////end product images/////
//////////edit profile////////
////////////////edit seller////
router.post("/editProfile/:user_id", (req, res) => {
  ///////////////for image only////////////
  ///////////////for image only////////////

  if (!req.files) {
    var role = 0;
    var status = "0";

    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hour = date_ob.getHours();
    let fullDate = year + "-" + month + "-" + date + "-" + hour;
    console.log("lastNameeeee:" + req.body.lastName);
    const data = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      role: role,
      address: req.body.address,
      //   profilePicture: img_name,
      status: status,
      date: fullDate,
    };
    var user_id = req.params.user_id;
    var rules = validationRules.sellers.update;
    var validator = new asyncValidator(rules);
    validator.validate(data, (errors, fields) => {
      if (!errors) {
        userModel.updateUser(user_id, data, function (result) {
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
    // return res.status(400).send('No files were uploaded.');
  } else {
    var file = req.files.profilePicture;
    var img_name = file.name;

    if (
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/png" ||
      file.mimetype == "image/gif"
    ) {
      file.mv("public/images/" + file.name, function (err) {
        if (err) return res.status(500).send("the errors were" + err);

        //////////////////end for image codes////////////
        var role = 0;
        var status = "0";

        let ts = Date.now();
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        let hour = date_ob.getHours();
        let fullDate = year + "-" + month + "-" + date + "-" + hour;
        // let passCodess = req.body.password;
        // console.log("lastNameeeee:" + req.body.lastName);
        const data = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phone: req.body.phone,
          // email: req.body.email,
          role: role,
          address: req.body.address,
          profilePicture: img_name,
          // gender: req.body.gender,
          status: status,
          date: fullDate,
        };
        var user_id = req.params.user_id;
        var rules = validationRules.sellers.update;
        var validator = new asyncValidator(rules);
        validator.validate(data, (errors, fields) => {
          if (!errors) {
            userModel.updateUserwithPhoto(user_id, data, function (result) {
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
//////////end edit profile////

//////save to slip/////////////

// router.post("/saveToorderhistory", (req, res) => {

// }
// )

router.post("/saveToOrderList", (req, res) => {
  console.log(req.body)
  let allData = JSON.stringify(req.body[0].user_id);
  console.log("lloo" + allData)
  let ts = Date.now();
  let date_ob = new Date(ts);
  var year = date_ob.getFullYear();
  var month = date_ob.getMonth() + 1;
  var date = date_ob.getDate();
  var hours = date_ob.getHours();
  var minutes = date_ob.getMinutes();
  var seconds = date_ob.getSeconds();
  // var milliSeconds=date_ob.getMilliseconds();
  var totalProducts = 0
  var allDatesFormats = year + "-" + month + "-" + date + "-" + hours + "-" + minutes + "" + seconds;
  var datess = year + "-" + month + "-" + date;
  ///////unique orderId////////////
  var OrderID = Math.floor(Math.random() * 100) + 1;
  console.log("all Data:" + allData);
  var status = 0;
  var uplodByy = "0"
  for (let i = 0; i < req.body.length; i++) {
    let allData = JSON.stringify(req.body[i].user_id);
    const data = {
      product_id: JSON.stringify(req.body[i].product_id),
      user_id: JSON.stringify(req.body[i].user_id),
      quantity: JSON.stringify(req.body[i].quantity),
      delivery: req.body[i].delivery_method,
      packaging: req.body[i].packaging,
      //////////added
      initialDate: JSON.stringify(req.body[i].initialDate),
      finalDate: JSON.stringify(req.body[i].finalDate),
      deliveryTime: JSON.stringify(req.body[i].deliveryTime),
      ///////////end added
      date: datess,
      timeStamp: allDatesFormats,
      OrderID: OrderID,
      status: status,
      uploadedBy: uplodByy
      //  totalPrice } = JSON.stringify(req.body[i]);
    };
    console.log("alld data:" + data.product_id + "" + data.user_id)
    /////////checkfor approved status///////////
    var checkStatus = "SELECT status FROM orderhistory WHERE user_id=?";

    db.executeQuery(
      checkStatus,
      [data.user_id],
      function (resultuk) {
        console.log("##########################")
      
        console.log("############################")
        // var statuses = resultuk[0].status;
        if (0 == 1) {
          return res.status(200).json({ Notification: 'you have to make payment for the last you Ordered!' });
        }
        else {
          /////////////end status  approve
          ////////////////////////////update product quantity/////////
          var sql = "SELECT quantity FROM product WHERE id=?";
          // var sql = "SELECT quantity AS quantity,count  AS count, COUNT(*)AS totalUsers FROM orderhistory WHERE product_id=?";
          db.executeQuery(
            sql,
            [data.product_id],
            function (resultp) {
              function stringToNumber(n) {
                return (typeof n === 'string') ? parseInt(Number(n.replace(/"|'/g, ''))) : n;
              }
              DBQuantity = stringToNumber(JSON.stringify(resultp[0].quantity));
              var newQuantity = stringToNumber(JSON.stringify(data.quantity));
              var difference = DBQuantity - newQuantity;
              var sql =
                "UPDATE product SET quantity = ? WHERE id = ?";
              db.executeQuery(
                sql,
                [
                  difference,
                  data.product_id
                ],
                function (resultp3) {
                });
            })
          ///////////////////////////end update product quantity//////
          // password:RCNDC2021&Yemane
          var TotalCount = 0;
          var sql = "SELECT totalProduct  AS count FROM countorderhistory WHERE product_id=?";
          // var sql = "SELECT quantity AS quantity,count  AS count, COUNT(*)AS totalUsers FROM orderhistory WHERE product_id=?";
          db.executeQuery(
            sql,
            [data.product_id],
            function (result2) {
              var quantitys = data.quantity;
              function stringToNumber(n) {
                return (typeof n === 'string') ? parseInt(Number(n.replace(/"|'/g, ''))) : n;
              }
              if (result2.length == 0) {
                // TotalCount= (stringToNumber(JSON.stringify(quantitys)));
                TotalCount = 1
                // console.log("totalUsers1:"+TotalCount)
                ///////////////////////////
                var sql = "INSERT INTO  countorderhistory VALUES(null, ?, ?,?,?)";
                db.executeQuery(
                  sql,
                  [data.product_id, data.user_id, TotalCount, data.date],
                  function (result3) {
                    
                    // callback(result1);
                    // return res.status(200).json({ success: true });
                  });
                ///////////////////////////
              }
              else {
                ///////////////////////////
                totalProducts = stringToNumber(JSON.stringify(result2[0].count)) + 1;
                var sql =
                  "UPDATE countorderhistory SET totalProduct = ? WHERE product_id = ?";
                db.executeQuery(
                  sql,
                  [
                    totalProducts,
                    data.product_id
                  ],
                  function (result3) {
                    // callback(result1);
                    // return res.status(200).json({ success: true });
                  });
                //////////////////////////
                // console.log("totalUsers1:"+stringToNumber(JSON.stringify(result2[0].count)))
              }
              ////start select data from slip history by product id
              var sqlUploadeby = "SELECT uploadedBy FROM product WHERE id=?";
              db.executeQuery(
                sqlUploadeby,
                [data.product_id],
                function (resultup) {
                  var uploadedByID = resultup[0].uploadedBy;
                  console.log("uploadedby:" + uploadedByID)
                  var sql = "INSERT INTO  orderhistory VALUES(null, ?, ?,?,?,?,?,?,?,?,?,?,?,?)";
                  db.executeQuery(
                    sql,
                    [data.product_id, data.user_id, data.quantity, data.date, data.timeStamp, data.OrderID, uploadedByID, data.status, data.initialDate, data.finalDate, data.deliveryTime,data.delivery,data.packaging],
                    function (result1) {
                      console.log("////////////////")
                      // callback(result1);
                      // return res.status(200).json({ success: true });
                    });
                })
            });
          //});//loop foreach
          // });
          ////////////////////
          ///for aproved status  
        }
      })
    ////end approved status
  }//else loop
  return res.status(200).json({ success: true });
  // });
  /////////////
});
///////////end ///////////////
////////end save to slip//////
///////////////////getAllHistory/////
router.get('/getAllHistory/:userId', (req, res) => {
  // let role =2;
  var userIds = req.params.userId;
  cartModel.getAllHistory(userIds, (result) => {
    if (!result) {
      res.status(200).json({ 'history': result });
    }
    else {
      console.log(result);
      res.status(200).json(result);
    }
  });
});
//////////getAllHistory///
router.get('/getAllCartHistory/:userId', (req, res) => {
  // let role =2;
  var userIds = req.params.userId;
  cartModel.getAllCartHistory(userIds, (result) => {
    if (!result) {
      res.status(200).json({ 'history': result });
    }
    else {
      console.log(result);
      res.status(200).json(result);
    }
  });
});
//////////////advertise///////
////////////////Advertise//////////////
router.post('/createAdvertise', (req, res) => {
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
      Description: req.body.Description,
      date: fullDate
    };
    // var seller_id = req.params.id;
    console.log("name:" + data.catagory_Name)
    var rules = validationRules.advertise.create;
    var validator = new asyncValidator(rules);
    validator.validate(data, (errors, fields) => {
      if (!errors) {
        catagoryModel.createAdvertise(data, function (result) {
          //go to userModel.js in models folder and
          //in this there is createuser()function to insert data to database.
          if (result) {
            console.log(result);
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
    // return res.status(400).send('No files were uploaded.');
  } else {
    var file = req.files.advertiseImage;
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
          advertiseImage: img_name,
          Description: req.body.Description,
          date: fullDate
        };
        // var seller_id = req.params.id;
        var rules = validationRules.advertise.create;
        var validator = new asyncValidator(rules);
        validator.validate(data, (errors, fields) => {
          if (!errors) {
            catagoryModel.createAdvertise(data, function (result) {
              //go to userModel.js in models folder and
              //in this there is createuser()function to insert data to database.
              if (result) {
                console.log(result);
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
router.post('/editAdvertise/:id', (req, res) => {
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
      Description: req.body.Description,
      date: fullDate
    };
    var advertise_id = req.params.id;
    var rules = validationRules.advertise.update;
    var validator = new asyncValidator(rules);
    validator.validate(data, (errors, fields) => {
      if (!errors) {
        catagoryModel.updateAdvertise(advertise_id, data, function (result) {//go to catagoryModel.js in models folder and
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
    // return res.status(400).send('No files were uploaded.');
  } else {
    var file = req.files.advertiseImage;
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
          Description: req.body.Description,
          advertiseImage: img_name,
          date: fullDate
        };
        // var seller_id = req.params.id;
        var advertise_id = req.params.id;
        var rules = validationRules.advertise.update;
        var validator = new asyncValidator(rules);
        validator.validate(data, (errors, fields) => {
          if (!errors) {
            catagoryModel.updateAdvertise(advertise_id, data, function (result) {
              //go to userModel.js in models folder and
              //in this there is createuser()function to insert data to database.
              if (result) {
                console.log(result);
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
router.get('/deleteAdvertise/:id', (req, res) => {
  var id = req.params.id;
  catagoryModel.deleteAdvertise(id, (result) => {
    if (result.length == 0) {
      res.status(200).json({ 'product': result });
    }
    else {
      // console.log(result);
      res.status(200).json({ success: true });
    }
  });
});
///////end catagory delte///
/////////show all catagory//
router.get('/getAllAdvertise', (req, res) => {
  catagoryModel.getAllAdvertise((result) => {
    if (!result) {
      res.status(200).json({ 'product': result });
    }
    else {
      // console.log(result);
      res.status(200).json(result);
    }
  });
});
///////////end ///////////////
router.get('/getAdvertiseByID/:id', (req, res) => {
  var id = req.params.id;
  catagoryModel.getAdvertiseByID(id, (result) => {
    if (result.length == 0) {
      res.status(200).json({ 'product': result });
    }
    else {
      console.log(result);
      res.status(200).json({ result });
    }
  });
});
/////////////end advertise////
router.get('/deleteProfileImage/:id', (req, res) => {
  var user_id = req.params.id;
  userModel.deleteProfileImage(user_id, (result) => {
    if (result.length == 0) {
      res.status(200).json({ 'image': 'Invalid' });
    }
    else {
      // console.log(result);
      res.status(200).json({ success: true });
    }
  });
});
router.get("/getApprovedOrders/:seller_id", (req, res) => {
  var seller_id = req.params.seller_id;
  ///////put expire time here///////
  ////////////end expire time//////
  userModel.getApprovedUserOrders(seller_id, (result) => {

    if (!result) {
      res.status(200).json({ orders: result });
    } else {
      //////////////start expire/////
      let ts = Date.now();
      let date_ob = new Date(ts);
      let hour = date_ob.getHours();
      let date = date_ob.getDate();
      let month = date_ob.getMonth() + 1;
      let year = date_ob.getFullYear();
      let fullDate = year + "-" + month + "-" + date;
      result.forEach((element) => {
        let startDates = element.date;
        let endDates = fullDate;
        let id = element.id;
        let filOne = startDates.split("-");
        let filTwo = endDates.split("-");
        var day1 = filOne[2];
        var day2 = filTwo[2];
        var diff = stringToNumber(day2 - day1);
        var year1 = filOne[0];
        var year2 = filTwo[0];
        yearDiff = year2 - year1;
        var month1 = filOne[1];
        var month2 = filTwo[1];
        function stringToNumber(n) {
          return (typeof n === 'string') ? parseInt(Number(n.replace(/"|'/g, ''))) : n;
        }
        var montDiff = month2 - month1;
        console.log("difference:" + diff)
        if (diff > 1 || montDiff > 0 || yearDiff > 0) {
          //  console.log("diff"+diff+"id"+id)
          //////////////////////
          var status = 4;
          // console.log("id:"+id+"status:"+status)
          var sql =
            "UPDATE orderhistory SET status =? WHERE id = ?";
          db.executeQuery(sql, [status, id],
            function (result) {
            }
          );
          /////////////////////
        }
      });
      ///////end expire///
      res.status(200).json({ orders: result });
    }
  });
});
///////////////end orders/////////
router.get("/getActiveOrders/:seller_id", (req, res) => {
  var seller_id = req.params.seller_id;
  ///////put expire time here///////
  ////////////end expire time//////
  userModel.getActiveUserOrders(seller_id, (result) => {
    if (!result) {
      res.status(200).json({ orders: result });
    } else {
      //////////////start expire/////
      let ts = Date.now();
      let date_ob = new Date(ts);
      let hour = date_ob.getHours();
      let date = date_ob.getDate();
      let month = date_ob.getMonth() + 1;
      let year = date_ob.getFullYear();
      let fullDate = year + "-" + month + "-" + date;
      result.forEach((element) => {
        let startDates = element.date;
        let endDates = fullDate;
        let id = element.id;
        let filOne = startDates.split("-");
        let filTwo = endDates.split("-");
        var day1 = filOne[2];
        var day2 = filTwo[2];
        var diff = stringToNumber(day2 - day1);
        var year1 = filOne[0];
        var year2 = filTwo[0];
        yearDiff = year2 - year1;
        var month1 = filOne[1];
        var month2 = filTwo[1];
        function stringToNumber(n) {
          return (typeof n === 'string') ? parseInt(Number(n.replace(/"|'/g, ''))) : n;
        }
        var montDiff = month2 - month1;
        // console.log("difference:"+diff)
        if (diff > 1 || montDiff > 0 || yearDiff > 0) {
          //  console.log("diff"+diff+"id"+id)
          //////////////////////
          var status = 4;
          // console.log("id:"+id+"status:"+status)
          var sql =
            "UPDATE orderhistory SET status =? WHERE id = ?";
          db.executeQuery(sql, [status, id],
            function (result) {
            }
          );
          /////////////////////
        }
      });
      ///////end expire///
      res.status(200).json({ orders: result });
    }
  });
});
router.get("/getDeclinedOrders/:seller_id", (req, res) => {
  var seller_id = req.params.seller_id;
  userModel.getUserOrders(seller_id, (result) => {

    if (!result) {
      res.status(200).json({ orders: result });
    } else {
      //////////////start expire/////
      let ts = Date.now();
      let date_ob = new Date(ts);
      let hour = date_ob.getHours();
      let date = date_ob.getDate();
      let month = date_ob.getMonth() + 1;
      let year = date_ob.getFullYear();
      let fullDate = year + "-" + month + "-" + date;
      result.forEach((element) => {
        let startDates = element.date;
        let endDates = fullDate;
        let id = element.id;
        let filOne = startDates.split("-");
        let filTwo = endDates.split("-");
        var day1 = filOne[2];
        var day2 = filTwo[2];
        var diff = stringToNumber(day2 - day1);
        var year1 = filOne[0];
        var year2 = filTwo[0];
        yearDiff = year2 - year1;
        var month1 = filOne[1];
        var month2 = filTwo[1];
        function stringToNumber(n) {
          return (typeof n === 'string') ? parseInt(Number(n.replace(/"|'/g, ''))) : n;
        }
        var montDiff = month2 - month1;
        console.log("difference:" + diff)
        if (diff > 1 || montDiff > 0 || yearDiff > 0) {
          //  console.log("diff"+diff+"id"+id)
          //////////////////////
          var status = 4;
          // console.log("id:"+id+"status:"+status)
          var sql =
            "UPDATE orderhistory SET status =? WHERE id = ?";
          db.executeQuery(sql, [status, id],
            function (result) {
            }
          );
          /////////////////////
        }
      });
      ///////end expire///
      res.status(200).json({ orders: result });
    }
  });
});
router.post("/changePurchaseStatus", (req, res) => {
  var status = req.body.status;
  var id = req.body.id;
  userModel.getUploadedBy(id, (result) => {
    var uplodedBys = result[0].uploadedBy;
    userModel.getStatusByUserID(uplodedBys, (resultpr) => {
      userStatus = resultpr[0].status;
      if (userStatus == 0 && status == 3) {
        userModel.deleteorderhistory(id, (resultd) => {
          if (!resultd) {
            res.status(200).json({ success: false });
          }
          else {
            res.status(200).json({ success: true });
          }
        })
      }
      else {
        userModel.changePurchaseStatus(status, id, (result) => {
          if (!result) {
            res.status(200).json({ success: false });
          } else {
            res.status(200).json({ success: true });
          }
        });
      }
    })
  });
});
router.get('/getSubCategory/:id', (req, res) => {
  var categoryID = req.params.id;
  catagoryModel.getSubCategory(categoryID, (result) => {
    if (result.length == 0) {
      res.status(200).json({ 'subcatagory': result });
    }
    else {
      // console.log(result);
      res.status(200).json({ 'subcatagory': result });
    }
  });
});
router.get('/getAllSubCategory', (req, res) => {
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
router.get('/getSingleSmsMessage/:userID', (req, res) => {
  var userIDs = req.params.userID;
  userChatModel.getSingleSmsMessage(userIDs, (result) => {
    if (!result) {
      console.log("not existed data")
    } else {
      res.status(200).json({ messages: result });
    }
  });
});
router.get('/getSingleSellerSmsMessage/:userID', (req, res) => {
  var userIDs = req.params.userID;
  userChatModel.getSingleSellerSmsMessage(userIDs, (result) => {
    if (!result) {
      console.log("not existed data");
    } else {
      res.status(200).json({ messages: result });
    }
  });
});



router.post('/purchase', (req, res) => {
     
  let ts = Date.now();
  let date_ob = new Date(ts);
  let date = date_ob.getDate();
  let month = date_ob.getMonth() + 1;
  let year = date_ob.getFullYear();
  let hour = date_ob.getHours();
  var codes = Math.floor(Math.random() * 100000) + 100000;
  let fullDate = year + '-' + month + '-' + date + '-' + hour;
  const data = ({
    userID,
    companyName,
    tinNumber,
    companyAddress,
    region,
    city,
    subCity,
    kebelle,
    postalCode,
    phoneNumber,
    orderID,
    price,
    vate,
    date,
  } = req.body);
  data.date = fullDate;
  var rules = validationRules.purchase.create;
  var validator = new asyncValidator(rules);
  validator.validate(data, (errors, fields) => {
    if (!errors) {
      userModel.createpurchase(data, function (result) {
        //go to productModel.js in models folder and

        if (result) {
          console.log(result);
          res.status(200).json({
            success: true,
          });
        } else {
          res.status(200).json({
            errs: 'Invalid credentials!.',
          });
        }
      });
    } else {
      console.log(fields);
      res.status(200).json({
        errs: 'not validated!.',
      });
    }
  });
});
router.post('/editPurchase/:id', (req, res) => {
  let ts = Date.now();
  let date_ob = new Date(ts);
  let date = date_ob.getDate();
  let month = date_ob.getMonth() + 1;
  let year = date_ob.getFullYear();
  let hour = date_ob.getHours();
  let fullDate = year + "-" + month + "-" + date + "-" + hour;
  var codes = (Math.floor(Math.random() * 100000) + 100000);
  var tarnsactionID=uuid.v4();
  const data = {
    userID,
    companyName,
    tinNumber,
    companyAddress,
    region,
    city,
    subCity,
    kebelle,
    postalCode,
    phoneNumber,
    orderID,
    price,
    vate,
    date,
    userID,
    companyName,
    tinNumber,
    companyAddress,
    region,
    city,
    subCity,
    kebelle,
    postalCode,
    phoneNumber,
    orderID,
    price,
    vate,
    date,
    transaction_uuid
  } = req.body;
  data.date = fullDate;
  data.transaction_uuid=tarnsactionID
  var rules = validationRules.purchase.update;
  var id = req.params.id;
  var validator = new asyncValidator(rules);
  validator.validate(data, (errors, fields) => {
    if (!errors) {
      userModel.updatepurchase(id, data, function (result) { //go to productModel.js in models folder and

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
////////////////////////////
router.post('/createDocuments', (req, res) => {
  var file = req.files.fileName;
  var fileNames = file.name;
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
      fileName: fileNames,
      documentName: req.body.documentName,
      Description: req.body.Description,
      date: fullDate
    };
    // var seller_id = req.params.id;
    var rules = validationRules.documents.create;
    var validator = new asyncValidator(rules);
    validator.validate(data, (errors, fields) => {
      if (!errors) {
        userModel.createDocuments(data, function (result) {
          if (result) {
            console.log(result);
            res.status(200).json({ success: true });
            // res.redirect('/login');
          } else {
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
});
router.post('/updateDocuments/:id', (req, res) => {
  var file = req.files.fileName;
  var fileNames = file.name;
  var documentID = req.params.id;
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
      fileName: fileNames,
      documentName: req.body.documentName	,
      Description: req.body.Description,
      date: fullDate
    };
    // var seller_id = req.params.id;
    console.log("update:"+req.body.fileName)
 console.log("id:"+documentID)
    var rules = validationRules.documents.update;
    var validator = new asyncValidator(rules);
    validator.validate(data, (errors, fields) => {
      if (!errors) {
        userModel.updateDocuments(data, documentID, function (result) {
          if (result) {
            ///////show all users//n
            userModel.getUserEmail((resultEmail) => {
              if (!resultEmail) {
                res.status(200).json({ User: resultEmail });
              } else {
                resultEmail.forEach((element) => {
                  console.log("datas:" + element.email)
                  // sent to gmail////////////
                  var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: 'yemie008@gmail.com',
                      pass: 'correctyear10'
                    }
                  });
                  var mailOptions = {
                    from: 'yemie008@gmail.com',//yemie008@gmail.com
                    to: element.email,
                    subject: 'some updates there on ' + data.fileName,
                    html: '<h1>Welcome</h1><p>Our company is updates the </p>' + data.fileName,
                  };
                  transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                  });
                });
              }
            });
            // ////////////end sent email//

            res.status(200).json({ success: true });
            // res.redirect('/login');
          } else {
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
});
router.get("/deleteDocuments/:id", (req, res) => {
  var id = req.params.id;
  userModel.deleteDocuments(id, (result) => {
    if (result.length == 0) {
      res.status(200).json({ documents: "Invalid" });
    } else {
      console.log(result);
      res.status(200).json({ documents: "document Completely Deleted!" });
    }
  });
});
router.get("/getDocuments/:name", (req, res) => {
  var documentName = req.params.name;
  // documentN = req.params.name;
  // var documentName = "%" + documentN.substring(0, 4).toLowerCase() + "%";
  // console.log("documentame:"+documentName)
  userModel.getDocuments(documentName, (result) => {
    if (result.length == 0) {
      res.status(200).json({ result });
    } else {
      // console.log("documeny\tsfsdf"+result[0].documentName);
      res.status(200).json({ result });
    }
  });
});
router.get("/getAllDocuments", (req, res) => {
  userModel.getAllDocuments((result) => {
    if (result.length == 0) {
      res.status(200).json({ result });
    } else {
      // console.log(result);
      res.status(200).json({ result });
    }
  });
});
router.get("/getSingleDocument/:id", (req, res) => {
  var id = req.params.id;
  userModel.getSingleDocument(id, (result) => {
    if (result.length == 0) {
      res.status(200).json({ documents: "Invalid" });
    } else {
      console.log(result);
      res.status(200).json({ result });
    }
  });
});
router.get("/getSingleSeller/:id", (req, res) => {
  var id = req.params.id;
  userModel.getSingleSeller(id, (result) => {
    if (result.length == 0) {
      res.status(200).json({ Seller: "Invalid" });
    } else {
            var collectionss = [];
            result.forEach((element) => {
              collectionss.push({
                seller_id: element.user_id,
                firstName: element.firstName,
                lastName: element.lastName,
                phone: element.phone,
                email: element.email,
                status: element.status,
                role: element.role,
                address: element.address,
                profilePicture: element.profilePicture,
                gender: element.gender,
                agreeStatus: element.agreeStatus,
                date: element.date,
                
              });
            });
            return res.status(200).json({ seller: collectionss });
    }
  });
});
///////////////////////////
router.get("/getAllComments", (req, res) => {
  userModel.getAllComments((result) => {
    if (result.length == 0) {
      res.status(200).json({ documents: "Invalid" });
    } else {
      // console.log(result);
      res.status(200).json({ result });
    }
  });
});
module.exports = router;
/////