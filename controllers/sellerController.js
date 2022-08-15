var express = require("express");
var router = express.Router();
var nodemailer = require("nodemailer");
var userModel = require("../models/userModel");
var productModel = require("../models/productModel");
var catagoryModel = require("../models/catagoryModel");
var cartModel = require("../models/cartModel");
var wishlistModel = require("../models/WishlistModel");
var db = require("../models/config");
var authorization = require('../middlewares/authorization');
// var bookModel = require.main.require('./models/bookModel');
var validationRules = require("../validation_rules/rules");
var asyncValidator = require("async-validator-2");
var fs = require('fs');
////////////start product//////////
router.post("/createProduct", (req, res) => {
  ///////////////for image only////////////

  if (!req.files) return res.status(400).send("No files were uploaded.");

  var file = req.files.Image;
  var img_name = file.name;

  if (
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/png" ||
    file.mimetype == "image/gif"
  ) {
    file.mv("public/images/" + file.name, function (err) {
      if (err) return res.status(500).send("the errors were" + err);

      //////////////////end for image codes////////////
      // const data = ({
      //   Category_id,
      //   Name,
      //   Description,
      //   Code,
      //   Price,
      //   Image,
      // } = req.body);
      const data = { Category_id, Name, Description, Code, Price, Image,uploadedBy,date,color,size,quantity,totalRate } = req.body;
      data.Image = img_name;
      data.totalRate=0
      data.Name=data.Name.toLowerCase();
      var rules = validationRules.products.create;
      var validator = new asyncValidator(rules);
      validator.validate(data, (errors, fields) => {
        if (!errors) {
          productModel.createProduct(data, function (result) {
            //go to productModel.js in models folder and

            if (result) {
              console.log(result);
              res.status(200).json({ success: true });
            } else {
              res.status(200).json({ errs: "Invalid credentials!." });
            }
          });
        } else {
          console.log(fields);
          res.status(200).json({ errs: "not validated!." });
        }
      });
      /////////start image brace
    });
  }
  /////end brace for image/////////
});

/////////show of that id//
router.get("/editProduct/:id", (req, res) => {
  var product_id = req.params.id;
  productModel.getProduct(product_id, (result) => {
    if (result.length == 0) {
      res.status(200).json({ product: result });
    } else {
      res.status(200).json({ product: result });
    }
  });
});
///////////end ///////////////

////////////////edit product/
router.post("/editProduct/:id", (req, res) => {
  // router.post('/create', (req, res) => {
  ///////////////for image only////////////

  if (!req.files) return res.status(400).send("No files were uploaded.");

  var file = req.files.Image;
  var img_name = file.name;

  if (
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/png" ||
    file.mimetype == "image/gif"
  ) {
    file.mv("images/" + file.name, function (err) {
      if (err) return res.status(500).send("the errors were" + err);

      //////////////////end for image codes////////////
      // const data = ({
      //   Category_id,
      //   Name,
      //   Description,
      //   Code,
      //   Price,
      //   Image,
      // } = req.body);
      const data = { Category_id, Name, Description, Code, Price, Image,uploadedBy,date,color,size,quantity } = req.body;
      data.Image = img_name;
      data.Name=data.Name.toLowerCase();
      var rules = validationRules.products.update;
      var id = req.params.id;
      var validator = new asyncValidator(rules);
      validator.validate(data, (errors, fields) => {
        if (!errors) {
          productModel.updateProduct(id, data, function (result) {
            //go to productModel.js in models folder and

            if (result) {
              console.log(result);
              res.status(200).json({ success: true });
            } else {
              res.status(200).json({ errs: "Invalid credentials!." });
            }
          });
        } else {
          console.log(fields);
          res.status(200).json({ errs: "not validated!." });
        }
      });
      /////////start image brace
    });
  }
  /////end brace for image/////////
});
/////////////end edit///////

//////////product delete///
router.get("/deleteProduct/:id", (req, res) => {
  var id = req.params.id;
  productModel.deleteProduct(id, (result) => {
    if (result.length == 0) {
      res.status(200).json({ product: "Invalid" });
    } else {
      console.log(result);
      res.status(200).json({ product: "product Completely Deleted!" });
    }
  });
});
///////end product delte///
/////////show all productss//
router.get("/getAllProducts/:uploadedBy",authorization.authenticateJWT, (req, res) => {
  // sess = req.session; //start the session
  // var sessionEmails = sess.email;
  console.log("seller site")
  var uploadedBy = req.params.uploadedBy;
  productModel.getAllProductssA(uploadedBy, (result) => {
    if (!result) {
      res.status(200).json({ product: "No data!" });
    } else {
      // console.log(result);
      res.status(200).json({ product: result });
    }
  });
});
///////////end ///////////////

////////////////sellers////////////
/////////show ser of that id//
///////////////////sellers/////
router.get("/getAllSellers",authorization.authenticateJWT, (req, res) => {
  let role = 2;
  userModel.getAllSellers(role, (result) => {
    if (!result) {
      res.status(200).json({ seller: result });
    } else {
      console.log(result);
      res.status(200).json(result);
    }
  });
});
//////////seller delete///
router.get("/deleteSeller/:id", (req, res) => {
  var id = req.params.id;
  userModel.deleteUser(id, (result) => {
    if (result.length == 0) {
      res.status(200).json({ User: "Invalid" });
    } else {
      console.log(result);
      res.status(200).json({ success: true });
    }
  });
});
//////////end delete seller////
////////////////edit seller////
router.post("/editSeller/:id", (req, res) => {
  ///////////////for image only////////////
  ///////////////for image only////////////

  if (!req.files) {
    var role = 2;
    var status = "0";

    let ts = Date.now();
    let date_ob = new Date(ts);
    let hour=date_ob.getHours();
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let fullDate = year + "-" + month + "-" + date + "-" + hour;
    // let fullDate = year + "-" + month + "-" + date;
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
    var seller_id = req.params.id;
    var rules = validationRules.sellers.update;
    var validator = new asyncValidator(rules);
    validator.validate(data, (errors, fields) => {
      if (!errors) {
        userModel.updateUser(seller_id, data, function (result) {
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
        var role = 2;
        var status = "0";

        let ts = Date.now();
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();

        // prints date & time in YYYY-MM-DD format
        let fullDate = year + "-" + month + "-" + date;
        // let passCodess = req.body.password;
        console.log("lastNameeeee:" + req.body.lastName);
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
        var seller_id = req.params.id;
        var rules = validationRules.sellers.update;
        var validator = new asyncValidator(rules);
        validator.validate(data, (errors, fields) => {
          if (!errors) {
            userModel.updateUser(seller_id, data, function (result) {
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
/////////////end edit///////
///////end user delte///
/////////show all users//
router.get("/getAllProfile/:seller_id",authorization.authenticateJWT, (req, res) => {
  var seller_id = req.params.seller_id;
  //sessionStorage.getItem("sessionEmails");
  userModel.getAllProfile(seller_id, (result) => {
    if (!result) {
      res.status(200).json({ sellers: result });
    } else {
      res.status(200).json({ sellers: result });
    }
  });
});
///////////end ///////////////
router.get("/getDeclinedOrders/:seller_id", (req, res) => {
  var seller_id = req.params.seller_id;
  ///////put expire time here///////
  ////////////end expire time//////
  userModel.getOrders(seller_id, (result) => {

    if (!result) {
      res.status(200).json({ orders: result });
    } else {
          //////////////start expire/////
          let ts = Date.now();
          let date_ob = new Date(ts);
          let hour=date_ob.getHours();
          let date = date_ob.getDate();
          let month = date_ob.getMonth() + 1;
          let year = date_ob.getFullYear();
          let fullDate = year + "-" + month + "-" + date;
    result.forEach((element) => {
      let startDates=element.date;
      let endDates=fullDate;
      let id=element.id;
      let filOne=startDates.split("-");
      let filTwo=endDates.split("-");
          var day1=filOne[2];
          var day2=filTwo[2];
          var diff=stringToNumber(day2-day1);
          var year1=filOne[0];
          var year2=filTwo[0];
          yearDiff=year2-year1;
          var month1=filOne[1];
          var month2=filTwo[1];
          function stringToNumber(n) {
            return (typeof n === 'string') ? parseInt(Number(n.replace(/"|'/g, ''))) : n;
              }
          var montDiff=month2-month1;
          console.log("difference:"+diff)
          if(diff>1||montDiff>0||yearDiff>0)
   {
     console.log("diff"+diff+"id"+id)
//////////////////////
var status=4;
console.log("id:"+id+"status:"+status)
var sql =
"UPDATE orderhistory SET status =? WHERE id = ?";
db.executeQuery(sql,[status,id],
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
router.post("/changePurchaseStatus", (req, res) => {
  var status = req.body.status;
  var id=req.body.id;
  userModel.getUploadedBy(id, (result) => {
    var uplodedBys=result[0].uploadedBy;
    userModel.getStatusByUserID(uplodedBys, (resultpr) => {
     userStatus=resultpr[0].status;
     if(userStatus==0 &&status==3)
     {
      userModel.deleteorderhistory(id, (resultd) => {
     if(!resultd)
     {
      res.status(200).json({ success: false });
     }
     else{
      res.status(200).json({ success: true });
     }
      })
     }
     else{
      userModel.changePurchaseStatus(status,id, (result) => {
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
router.get("/getApprovedOrders/:seller_id", (req, res) => {
  var seller_id = req.params.seller_id;
  ///////put expire time here///////
  ////////////end expire time//////
  userModel.getApprovedOrders(seller_id, (result) => {

    if (!result) {
      res.status(200).json({ orders: result });
    } else {
          //////////////start expire/////
          let ts = Date.now();
          let date_ob = new Date(ts);
          let hour=date_ob.getHours();
          let date = date_ob.getDate();
          let month = date_ob.getMonth() + 1;
          let year = date_ob.getFullYear();
          let fullDate = year + "-" + month + "-" + date;
    result.forEach((element) => {
      let startDates=element.date;
      let endDates=fullDate;
      let id=element.id;
      let filOne=startDates.split("-");
      let filTwo=endDates.split("-");
          var day1=filOne[2];
          var day2=filTwo[2];
          var diff=stringToNumber(day2-day1);
          var year1=filOne[0];
          var year2=filTwo[0];
          yearDiff=year2-year1;
          var month1=filOne[1];
          var month2=filTwo[1];
          function stringToNumber(n) {
            return (typeof n === 'string') ? parseInt(Number(n.replace(/"|'/g, ''))) : n;
              }
          var montDiff=month2-month1;
          console.log("difference:"+diff)
      if(diff>1||montDiff>0||yearDiff>0)
   {
     console.log("diff"+diff+"id"+id)
//////////////////////
var status=4;
// console.log("id:"+id+"status:"+status)
var sql =
"UPDATE orderhistory SET status =? WHERE id = ?";
db.executeQuery(sql,[status,id],
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
  userModel.getActiveOrders(seller_id, (result) => {

    if (!result) {
      res.status(200).json({ orders: result });
    } else {
          //////////////start expire/////
          let ts = Date.now();
          let date_ob = new Date(ts);
          let hour=date_ob.getHours();
          let date = date_ob.getDate();
          let month = date_ob.getMonth() + 1;
          let year = date_ob.getFullYear();
          let fullDate = year + "-" + month + "-" + date;
    result.forEach((element) => {
      let startDates=element.date;
      let endDates=fullDate;
      let id=element.id;
      let filOne=startDates.split("-");
      let filTwo=endDates.split("-");
          var day1=filOne[2];
          var day2=filTwo[2];
          var diff=stringToNumber(day2-day1);
          var year1=filOne[0];
          var year2=filTwo[0];
          yearDiff=year2-year1;
          var month1=filOne[1];
          var month2=filTwo[1];
          function stringToNumber(n) {
            return (typeof n === 'string') ? parseInt(Number(n.replace(/"|'/g, ''))) : n;
              }
          var montDiff=stringToNumber(month2-month1);
          console.log("difference:"+diff)
   if(diff>1||montDiff>0||yearDiff>0)
   {
     console.log("diff"+diff+"id"+id)
//////////////////////
var status=4;
// console.log("id:"+id+"status:"+status)
var sql =
"UPDATE orderhistory SET status =? WHERE id = ?";
db.executeQuery(sql,[status,id],
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
module.exports = router;
