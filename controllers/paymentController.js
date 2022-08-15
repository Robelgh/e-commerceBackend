const crypto = require("crypto");
const express = require("express");
const uuid = require("uuid");
const bodyParser = require("body-parser");
const cors = require("cors");
const { pick } = require("ramda");
var router = express.Router();
const config = require("../models/paymentConfigModel");
// var db = require("../models/config");
const app = express();
app.use(express.json());
//////////////cors start////
app.use(cors());
var productModel = require('../models/productModel');
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
// app.set('views', __dirname + '/views');
path = require('path'),
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: true }));

const UNSIGNED_FIELD_NAMES = [  ];
const SIGNED_FIELD_NAMES = [
  "access_key",
  "amount",
  "currency",
  "locale",
  "payment_method",
  "profile_id",
  "reference_number",
  "signed_date_time",
  "signed_field_names",
  "transaction_type",
  "transaction_uuid",
  "unsigned_field_names"
];

// router.get("/", (req, res) => {
//   const locals = {
//     accessKey: config.cybersource.ACCESS_KEY,
//     customerIpAddress: req.ip,
//     deviceFingerprintId: uuid.v4(),
//     orgId: config.cybersource.ORG_ID,
//     profileId: config.cybersource.PROFILE_ID,
//     referenceNumber: uuid.v4(),
//     signedFieldNames: SIGNED_FIELD_NAMES.join(","),
//     unsignedFieldNames: UNSIGNED_FIELD_NAMES.join(",")
//   };

//   res.render("checkout", locals);
// });

router.post("/", cors({ origin: config.CORS_ALLOWED_HOSTS }), (req, res) => {
  const { body: input } = req;
  ////////////////////
  // const data = {
  //   access_key:config.cybersource.ACCESS_KEY,
  //   amount:req.body.amount,
  //   currency:req.body.currency,
  //   locale:req.body.locale,
  //   payment_method:req.body.payment_method,
  //   profile_id:config.cybersource.PROFILE_ID,
  //   referenceNumber: uuid.v4(),
  //   signed_date_time,
  //   signedFieldNames: SIGNED_FIELD_NAMES.join(","),
  //   transaction_type,
  //   transaction_uuid,
  //   orgId: config.cybersource.ORG_ID,
  //   deviceFingerprintId: uuid.v4(),
  //   customerIpAddress: req.ip,
  //   unsignedFieldNames: UNSIGNED_FIELD_NAMES.join(",")
  // };
  ///////////////////
  const allFieldsToSign = {
    // ...pick(SIGNED_FIELD_NAMES, data),
    ...pick(SIGNED_FIELD_NAMES, input),
    signed_date_time: convertToSignatureDate(new Date()),
    signed_field_names: SIGNED_FIELD_NAMES.join(","),
    unsigned_field_names: UNSIGNED_FIELD_NAMES.join(",")
  };
  const signature = sign(allFieldsToSign);
  console.log(allFieldsToSign);
  res.json({ ...allFieldsToSign, signature });
});

router.post('/response', (req, res) => {
  res.json("req.body");
});


// app.listen(5000);

// console.log("Listening at http://localhost:5000");

function convertToSignatureDate(d) {
  const [ isoDate ] = d.toISOString().split(".");

  return `${isoDate}Z`;
}

function sign(fields) {
  const hash = crypto.createHmac("sha256", config.cybersource.SECRET_KEY);
  const encodedFields = Object.keys(fields).sort().map(k => `${k}=${fields[ k ]}`).join(",");

  return hash.update(encodedFields).digest("base64");
}
router.get('/getPurchasedProducts/:userID', (req, res) => {
  let ts = Date.now();
  let date_ob = new Date(ts);
  let hour = date_ob.getHours();
  let date = date_ob.getDate();
  let month = date_ob.getMonth() + 1;
  let year = date_ob.getFullYear();
  let fullDate = year + "-" + month + "-" + date + "-" + hour;
  var userId=req.params.userID;
  productModel.getPurchasedProducts(fullDate,userId,(result) => {
    console.log("userID:"+userId+"date:"+fullDate)
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
module.exports = router;
