var db = require("../models/config");
///////////////////////////////////////
var createCatagory = (catagory, callback) => {
  var sql = "INSERT INTO  category VALUES(null, ?, ?,?,?,?)";
  db.executeQuery(
    sql,
    [catagory.catagory_Name,catagory.Description,catagory.categoryImage,catagory.date,catagory.parent],
    function (result) {
      callback(result);
    }
  );
};

///////////////////////////////////////
var getCatagory = (id, callback) => {
  var sql = "SELECT * FROM category WHERE id=?";
  db.executeQuery(sql, [id], function (result) {
    callback(result[0]);
  });
};
var catagoryProducts = (id, callback) => {
  var sql = "SELECT * FROM product WHERE Category_id=?";
  db.executeQuery(sql, [id], function (result) {
    callback(result);
  });
};
var getAllCatagory = (callback) => {
  var sql = "SELECT * FROM category WHERE parent IS NULL ORDER BY id DESC";
  db.executeQuery(sql, null, function (result) {
    callback(result);
  });
};
var updateCatagory = (id, catagory, callback) => {
  var sql =
    "UPDATE category SET catagory_Name = ?, Description = ?,categoryImage=?,date=?WHERE id = ?";
  db.executeQuery(
    sql,
    [catagory.catagory_Name, catagory.Description,catagory.categoryImage,catagory.date, id],
    function (result) {
      callback(result);
    }
  );
};

var deleteCatagory = (id, callback) => {
  var sql = "DELETE FROM category WHERE id = ?";
  db.executeQuery(sql, [id], function (result) {
    callback(result);
  });
};
/////total report
var totalCatagory = (callback) => {
  var sql = "SELECT COUNT(*) AS totalCatagory FROM category";
  db.executeQuery(sql,null, function (result) {
    callback(result);
  });
};
//////////////////advertise ///////
var getAllAdvertise = (callback) => {
  var sql = "SELECT * FROM advertise ORDER BY id DESC";
  db.executeQuery(sql, null, function (result) {
    callback(result);
  });
};
var updateAdvertise = (id, advertise, callback) => {
  var sql =
    "UPDATE advertise SET advertiseImage = ?,Description = ?,date=? WHERE id = ?";
  db.executeQuery(
    sql,
    [advertise.advertiseImage, advertise.Description,advertise.date, id],
    function (result) {
      callback(result);
    }
  );
};

var deleteAdvertise = (id, callback) => {
  var sql = "DELETE FROM advertise WHERE id = ?";
  db.executeQuery(sql, [id], function (result) {
    callback(result);
  });
};
var createAdvertise = (advertise, callback) => {
  var sql = "INSERT INTO  advertise VALUES(null, ?, ?,?)";
  db.executeQuery(
    sql,
    [advertise.advertiseImage,advertise.Description,advertise.date],
    function (result) {
      callback(result);
    }
  );
};
var getAdvertiseByID = (id, callback) => {
  var sql = "SELECT * FROM advertise WHERE id = ?";
  db.executeQuery(sql, [id], function (result) {
    callback(result);
  });
};
/////////////////end advertise////
var getSubCategory = (catagoryID, callback) => {
  var sql = "SELECT * FROM category WHERE parent=?";
  db.executeQuery(sql, [catagoryID], function (result) {
    callback(result);
  });
};
var getAllSubCategory = (callback) => {
  var sql = "SELECT * FROM category WHERE parent IS NOT NULL";
  db.executeQuery(sql, [null], function (result) {
    callback(result);
  });
};
module.exports = {
  // createProduct
  createCatagory,
  getCatagory,
  deleteCatagory,
  updateCatagory,
  getAllCatagory,
  catagoryProducts,
  totalCatagory,
  getAllAdvertise,
  updateAdvertise,
  deleteAdvertise,
  createAdvertise,
  getAdvertiseByID,
  getSubCategory,
  getAllSubCategory
};
