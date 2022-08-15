var db = require("../models/config");
///////////////////////////////////////
var createOrder = (Cart, callback) => {
  var sql = "INSERT INTO  cart VALUES(null, ?, ?,?,?,?)";
  db.executeQuery(
    sql,
    [Cart.product_id, Cart.user_id, Cart.quantity,Cart.selectedSize,Cart.selectedColor],
    function (result) {
      callback(result);
    }
  );
};

///////////////////////////////////////
var getCart = (user_id, callback) => {
  var sql = "SELECT * FROM cart WHERE user_id=?";
  db.executeQuery(sql, [user_id], function (result) {
    callback(result);
  });
};
var getAllCart = (callback) => {
  var sql = "SELECT * FROM cart";
  db.executeQuery(sql, null, function (result) {
    callback(result);
  });
};
var updateCart = (id, cart, callback) => {
  var sql =
    "UPDATE cart SET product_id = ?, user_id = ?,selectedSize=?,,selectedColor =?, quantity = ? WHERE id = ?";
  db.executeQuery(
    sql,
    [cart.product_id, cart.user_id, cart.quantity, cart.totalPrice,cart.selectedSize,cart.selectedColor, id],
    function (result) {
      callback(result);
    }
  );
};
var deleteCart = (id, callback) => {
  var sql = "DELETE FROM cart WHERE user_id = ?";
  db.executeQuery(sql, [id], function (result) {
    callback(result);
  });
};
////delete all carts
var deleteAllCart = (data,callback) => {
  var sql = "DELETE FROM cart WHERE user_id = ?";
  db.executeQuery(sql, [data.user_id], function (result) {
    callback(result);
  });
};
////delete all carts
var deleteAllCartHistory = (callback) => {
  var sql = "DELETE FROM orderhistory";
  db.executeQuery(sql,null, function (result) {
    callback(result);
  });
};
///create slip
var createSlip = (Slip, callback) => {
  var sql = "INSERT INTO slip VALUES(null, ?, ?,?,?,?,?,?)";
  db.executeQuery(
    sql,
    [
      Slip.productName,
      Slip.UserName,
      Slip.date,
      Slip.productPrice,
      Slip.quantity,
      Slip.vate,
      Slip.email,
    ],
    function (result) {
      callback(result);
    }
  );
};

var getAllSlips = (sessionEmails, callback) => {
  var sql = "SELECT * FROM slip WHERE email = ?";
  db.executeQuery(sql, [sessionEmails], function (result) {
    callback(result);
  });
};
var datedSlips = (datess, callback) => {
  var sql = "SELECT date FROM slip WHERE date =?";
  db.executeQuery(sql, [datess], function (result1) {
    callback(result1);
  });
};
///cart hstory////////
var createHistory = (Chistory, callback) => {
  var sql = "INSERT INTO  orderList VALUES(null, ?, ?,?)";
  db.executeQuery(
    sql,
    [Chistory.product_id, Chistory.user_id, Chistory.quantity],
    function (result1) {
      callback(result1);
    }
  );
};
////end cart history//
////save to slip table//////////
var getAllCartHistory = (user_ids,callback) => {
  // var sql = "SELECT DISTINCT user_id,product_id,quantity FROM orderList WHERE user_id=? ORDER BY user_id";
  var sql = "SELECT user_id,product_id,quantity FROM orderList WHERE user_id=? ORDER BY user_id";
  db.executeQuery(sql,[user_ids], function (result) {
    callback(result);
  });
};
var getAllCarts = (user_ids,callback) => {
  // var sql = "SELECT DISTINCT user_id,product_id,quantity FROM orderList WHERE user_id=? ORDER BY user_id";
  var sql = "SELECT user_id,product_id,quantity FROM cart WHERE user_id=? ORDER BY user_id";
  db.executeQuery(sql,[user_ids], function (result) {
    callback(result);
  });
};
////save to cartHistory
var saveCartHistory = (Chistory, callback) => {
  var sql = "INSERT INTO  orderhistory VALUES(null, ?, ?,?,?,?)";
  db.executeQuery(
    sql,
    [Chistory.product_id, Chistory.user_id, Chistory.quantity,Chistory.date],
    function (result1) {
      callback(result1);
    }
  );
};
///////end save to slip table///
var getAllHistory = (userId,callback) => {
  var sql =
    "SELECT  orderhistory.product_id,orderhistory.user_id  , orderhistory.quantity, orderhistory.date,orderhistory.timeStamp, product.Price FROM orderhistory LEFT JOIN product ON orderhistory.product_id = product.id WHERE orderhistory.user_id = ? ORDER BY orderhistory.timeStamp DESC";
  // var sql = "SELECT * FROM orderhistory WHERE user_id=? ORDER BY timeStamp DESC";
  db.executeQuery(sql,[userId], function (result) {
    callback(result);
  });
};
module.exports = {
  // createProduct
  createOrder,
  updateCart,
  getAllCart,
  deleteCart,
  getCart,
  deleteAllCart,
  getAllSlips,
  createSlip,
  datedSlips,
  createHistory,
  getAllCartHistory,
  saveCartHistory,
  deleteAllCartHistory,
  getAllHistory,
  getAllCarts
};
