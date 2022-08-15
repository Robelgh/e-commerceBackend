var db = require("../models/config");
///////////////////////////////////////
var createWishlist = (wishlist, callback) => {
  var sql = "INSERT INTO  wishlist VALUES(null, ?, ?)";
  db.executeQuery(sql,[wishlist.product_id, wishlist.user_id],
    function (result) {
      callback(result);
    }
  );
};
///////////////////////////////////////
var getWishlist = (user_id, callback) => {
  var sql = "SELECT * FROM wishlist WHERE user_id=?";
  db.executeQuery(sql, [user_id], function (result) {
    callback(result);
  });
};
var getAllWishlist = (callback) => {
  var sql = "SELECT * FROM wishlist";
  db.executeQuery(sql, null, function (result) {
    callback(result);
  });
};
var updateWishlist = (id, wishlist, callback) => {
  var sql =
    "UPDATE wishlist SET product_id = ?, user_id = ? WHERE id = ?";
  db.executeQuery(
    sql,
    [wishlist.product_id, wishlist.user_id, id],
    function (result) {
      callback(result);
    }
  );
};
var deleteWishlist = (id, callback) => {
  var sql = "DELETE FROM wishlist WHERE id = ?";
  db.executeQuery(sql, [id], function (result) {
    callback(result);
  });
};
////delete all carts
var deleteAllWishlist = (data,callback) => {
  var sql = "DELETE FROM wishlist WHERE user_id = ?";
  db.executeQuery(sql, [data.user_id], function (result) {
    callback(result);
  });
};
module.exports = {
  // createProduct
  createWishlist,
  getWishlist,
  getAllWishlist,
  updateWishlist,
  deleteWishlist,
  deleteAllWishlist,
};
