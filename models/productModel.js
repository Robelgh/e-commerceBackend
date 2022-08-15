var db = require("../models/config");
///////////////////////////////////////

///////////////////////////////////////
/////////////////////add productPhoto//////////////////
var productPhoto = (product, callback) => {
  var sql = "INSERT INTO productphotos VALUES(null, ?, ?)";
  db.executeQuery(
    sql,
    [product.product_id, product.product_image],
    function (result) {
      callback(result);
    }
  );
};
var productPhotoEdit = (id, product, callback) => {
  console.log("edit product edit...id")
  console.log(id)
  console.log(product)
  var sql =
    "UPDATE productphotos SET product_id = ?, product_image = ? WHERE id = ?";
  db.executeQuery(
    sql,
    [product.product_id, product.product_image, id],
    function (result) {
      callback(result);
    }
  );
};
var getProductPhoto = (id, callback) => {
  var sql = "SELECT * FROM productphotos WHERE photoId =?";
  db.executeQuery(sql, [id], function (result) {
    callback(result[0]);
  });
};
var getAllProductPhoto = (callback) => {
  var sql = "SELECT * FROM productphotos";
  db.executeQuery(sql, null, function (result) {
    callback(result);
  });
};
var deleteProductPhoto = (id, callback) => {
  var sql = "DELETE FROM productphotos WHERE photoId = ?";
  db.executeQuery(sql, [id], function (result) {
    callback(result);
  });
};
///////////////////////////////////////
var getProduct = (id, callback) => {
  var sql = "SELECT * FROM product WHERE id=?";
  db.executeQuery(sql, [id], function (result) {
    callback(result);
  });
};
var getAllProducts = (uploadedBy, callback) => {
  
  var sql =
    "SELECT  product.Name,product.uploadedBy,product.totalRate, product.id,product.quantity, product.Code,product.Description,product.color, product.size, product.Price, product.Image,category.catagory_Name FROM product LEFT JOIN category ON product.Category_id = category.id WHERE uploadedBy = ? AND product.quantity>0 ORDER BY product.id DESC";
  db.executeQuery(sql, [uploadedBy], function (result) {
    callback(result);
  });
};
var getAllProductssA = (uploadedBy, callback) => {

  // col1 as `MyNameForCol1`
 
  var sql =
  "SELECT  product.Name,users.firstName,users.lastName,product.uploadedBy,product.totalRate, product.id, product.color,product.orgin,product.age,product.Available, product.size as weight, product.Code,product.Description, product.Price,product.quantity, product.Image,category.catagory_Name FROM product LEFT JOIN category ON product.Category_id = category.id LEFT JOIN users ON users.user_id = product.uploadedBy ORDER BY product.id DESC";
  db.executeQuery(sql, [uploadedBy], function (result) {
    callback(result);
  });
};
var getAllProductss = (callback) => {
  var sql =
    "SELECT  product.Name,users.firstName,users.lastName,product.totalRate,product.uploadedBy, product.id, product.color, product.size, product.Code,product.Description, product.Price,product.quantity, product.Image,category.catagory_Name FROM product LEFT JOIN category ON product.Category_id = category.id LEFT JOIN users ON users.user_id = product.uploadedBy WHERE product.quantity >0 ORDER BY product.id DESC";
  // var sql = "SELECT * FROM product CROSS JOIN category";
  db.executeQuery(sql, null, function (result) {
    callback(result);
  });
};
var getAllProductsssA = (callback) => {
  var sql =
    "SELECT  product.Name,users.firstName,users.lastName,product.uploadedBy,product.totalRate, product.id, product.color,product.orgin,product.age,product.Available, product.size as weight, product.Code,product.Description, product.Price,product.quantity, product.Image,category.catagory_Name FROM product LEFT JOIN category ON product.Category_id = category.id LEFT JOIN users ON users.user_id = product.uploadedBy ORDER BY product.id DESC";
  // var sql = "SELECT * FROM product CROSS JOIN category";
  db.executeQuery(sql, null, function (result) {
    callback(result);
  });
};
var getUserProducts = (NumPages, callback) => {
  var sql = "SELECT * FROM product WHERE 	quantity >0 ORDER BY id DESC LIMIT 50 OFFSET ?";
  // var sql = "SELECT * FROM product LIMIT 50 OFFSET ?";
  db.executeQuery(sql, [NumPages], function (result) {
    callback(result);
  });
};
var updateProduct = (id, product,callback) => {

  console.log("products to be updated")
  console.log(id)
  console.log(product)
  var sql =
    "UPDATE product SET Category_id = ?, Name = ?,quantity=?, Description = ?,Code = ?,Price = ?, Image = ?,date=?,color=?,size=? WHERE id = ?";
  var deliveryID="SELECT delivery_id FROM productdelivery WHERE product_id=?"
  var delivery="SELECT `fob_id`, `cif_id`, `gate` FROM `delivery_method` WHERE id=?"
  var deliverySubCatagory="SELECT `airport`, `djibouti`, `berbera` FROM `fob` WHERE `fob_id`=?"  
  var sqlUDM="UPDATE delivery_method SET `gate`=? WHERE id=?" ;
  var sqlUCIF="UPDATE `cif` SET `shipping`=?,`flight`=? WHERE cif_id=?" 
  var sqlUFOB="UPDATE fob SET airport=?,djibouti=?,berbera=? WHERE fob_id"

  db.executeQuery(sql,[product.Category_id,  product.Name,product.quantity,product.Description,product.Code,product.Price,product.Image,product.date,product.color,product.weight,id],
    function (result) {
      console.log("product updated")
      console.log(product)
      console.log(result)
      console.log("................")
      callback(result);
      
    }
  );

  db.executeQuery(deliveryID, [id], function (result) {
    var deliveryID=result[0].delivery_id
    console.log("delivery id")
    console.log(deliveryID)
    db.executeQuery(sqlUDM,[product.delivery.GATE,deliveryID],
    function (result) {
      console.log(result);
    }
  );
  db.executeQuery(delivery,[deliveryID],
    function (result) {
      console.log(result);
      var fob_id=result[0].fob_id;
      var cif_id=result[0].cif_id

      db.executeQuery(sqlUFOB,[product.delivery.airport,product.delivery.djibouti,product.delivery.berbera,fob_id],
        function (result) {
          console.log(result);
        }
      );
      db.executeQuery(sqlUCIF,[product.delivery.shipping,product.delivery.flight,cif_id],
        function (result) {
          console.log(result);
        }
      );
    }
  );
  })

};

var deleteProduct = (id, callback) => {
  var sql = "DELETE FROM product WHERE id = ?";
  db.executeQuery(sql, [id], function (result) {
    callback(result);
  });
};
////////////////search products///////
// var sql = "SELECT * FROM product LIMIT 2 OFFSET ?";
var searchProducts = (productName,cID, callback) => {
  // var sql = "SELECT * FROM product WHERE Category_id =? AND quantity >0";
  var sql = "SELECT * FROM product WHERE Name LIKE ? OR Category_id =? AND quantity >0";
  // db.executeQuery(sql, [cID], function (result) {
  db.executeQuery(sql, [productName,cID], function (result) {
    callback(result);
  });
};
///////end search products/////
var searchProductsByCategory = (productName, callback) => {
  // var sql = "SELECT * FROM product WHERE Name LIKE ?";
  var sql = "SELECT id FROM category WHERE catagory_Name LIKE ?";
  db.executeQuery(sql, [productName], function (resultc) {
    callback(resultc[0]);
  });
};
var productByCatagory = (catagoryNames, callback) => {
  // var sql = "SELECT * FROM product WHERE Name=?";
  var sql =
    "SELECT  product.Name,product.uploadedBy,product.totalRate,product.quantity, product.id, product.Code,product.Description,product.color, product.size, product.Price, product.Image,category.catagory_Name FROM product LEFT JOIN category ON product.Category_id = category.id WHERE category.catagory_Name = ? AND product.quantity >0 ORDER BY product.id DESC";
  db.executeQuery(sql, [catagoryNames], function (result) {
    callback(result);
  });
};
var productBySubCatagory = (catagoryNames, callback) => {
  // var sql = "SELECT * FROM product WHERE Name=?";
  var sql =
    "SELECT  product.Name,product.uploadedBy,product.quantity,product.totalRate,product.Category_id, product.id, product.Code,product.Description,product.color, product.size, product.Price, product.Image,category.catagory_Name,category.parent FROM product LEFT JOIN category ON product.Category_id = category.id WHERE category.catagory_Name = ? AND product.quantity >0 ORDER BY product.id DESC";
  db.executeQuery(sql, [catagoryNames], function (result) {
    callback(result);
  });
};
// var productBySubCatagory2 = (cataoryID, callback) => {
//   // var sql = "SELECT * FROM product WHERE Name=?";
//   var sql =
//     "SELECT  product.Name,product.uploadedBy,product.quantity,product.Category_id, product.id, product.Code,product.Description,product.color, product.size, product.Price, product.Image,category.catagory_Name,category.parent FROM product LEFT JOIN category ON product.Category_id = category.parent WHERE category.parent = ? AND product.quantity >0 ORDER BY product.id DESC";
//   db.executeQuery(sql, [cataoryID], function (result) {
//     callback(result);
//   });
// };
// var productByCatagoryID = (catagoryID, callback) => {
//   // var sql = "SELECT * FROM product WHERE Name=?";
//   var sql = "SELECT * FROM product WHERE Category_id= ?";
//   db.executeQuery(sql, [catagoryID], function (resultc1) {
//     callback(resultc1);
//   });
// };
////////////// product images with key images////
var getProductImages = (product_id, callback) => {
  var sql = "SELECT * FROM productphotos WHERE product_id = ?";
  db.executeQuery(sql, [product_id], function (result) {
    callback(result);
  });
};
///////////product id/////
var getProductId = (callback) => {
  var sql = "SELECT * FROM product ORDER BY id DESC LIMIT 1";
  // var sql = "SELECT * FROM product LIMIT 10 OFFSET ?";
  db.executeQuery(sql, null, function (result) {
    callback(result);
  });
};
///////////////////end///////
//////end reports////
var totalProduct = (callback) => {
  var sql = "SELECT COUNT(*) AS totalProduct FROM product";
  db.executeQuery(sql,null, function (result) {
    callback(result);
  });
};
/////////product summary reports///
var monthlyProductsReport = (fullDate,callback) => {
  var sql = "SELECT * FROM product WHERE date LIKE ? ";
  db.executeQuery(sql, [fullDate], function (result) {
    callback(result);
  });
};
var weeklyProductsReport = (fullDate,callback) => {
  var sql = "SELECT * FROM product WHERE date LIKE ? ";
  db.executeQuery(sql, [fullDate], function (result) {
    callback(result);
  });
};
var dailyProductReport = (datess,callback) => {
  var sql = "SELECT * FROM product WHERE date LIKE ? ";
  db.executeQuery(sql, [datess], function (result) {
    callback(result);
  });
};
////////yearly
var yearlyProductsReport = (years,callback) => {
  var sql = "SELECT * FROM product WHERE date LIKE ?";
  db.executeQuery(sql, [years], function (result) {
  callback(result);
  });
};
/////////end product reports//////
var getSimilarProducts = (Category_id, callback) => {
  var sql = "SELECT * FROM product WHERE Category_id = ? AND quantity >0";
  db.executeQuery(sql, [Category_id], function (result) {
    callback(result);
  });
};

/////////////product specifications////////
var createPrRating = (product, callback) => {
  var sql = "INSERT INTO  product_rating_values VALUES(null, ?, ?, ?, ?)";
  db.executeQuery(
    sql,
    [
      product.user_id,
      product.product_id,
      product.ratingValues,
      // product.review,
      product.date,
    ],
    function (result) {
      callback(result);
    }
  );
};

var getAllProductRating = (callback) => {
  var sql =
    "SELECT * FROM product_rating_values ORDER BY id DESC";
  db.executeQuery(sql, null, function (result) {
    callback(result);
  });
};

var getRatingProducts = (data , callback) => {
  var sql = "SELECT * FROM product_rating_values WHERE product_id  = ? AND user_id=?";
  db.executeQuery(sql, [data.product_id,data.user_id ], function (result) {
    callback(result);
  });
};
var updatePrRating = (pro_id, product, callback) => {
  var sql =
    "UPDATE product_rating_values SET user_id =?,product_id = ?, ratingValues = ?, date = ? WHERE product_id = ?";
  db.executeQuery(sql,[product.user_id,product.product_id,product.ratingValues,product.date,pro_id],
    function (result) {
      callback(result);
    }
  );
};

var getRatingByProductID = (data , callback) => {
  var sql = "SELECT * FROM product_rating_values WHERE product_id  = ?";
  db.executeQuery(sql, [data.product_id], function (result1) {
    callback(result1);
  });
};
///////end product Rating/////////

//////////poplated///////////
var getPopulatedProducts = (callback) => {
  // var sql = "SELECT * FROM countorderhistory ORDER BY id DESC LIMIT 4";
  var sql =
  "SELECT  product.Name,product.uploadedBy,product.Code,product.totalRate,product.quantity,product.id,product.Description,product.color,product.size, product.Price,countorderhistory.totalProduct FROM  countorderhistory LEFT JOIN product ON countorderhistory.product_id =  product.id WHERE product.quantity >0 ORDER BY countorderhistory.totalProduct DESC LIMIT 4";
  db.executeQuery(sql, null, function (result) {
    callback(result);
  });
};
//////////end populated//////
///////////get pupular products by rating//////////
var getPopularProductsByRate = (callback) => {
  // var sql = "SELECT * FROM countorderhistory ORDER BY id DESC LIMIT 4";
  var sql =
  "SELECT  product.Name,product.uploadedBy,product.Code,product.totalRate,product.quantity,product.id,product.Description,product.color,product.size, product.Price,product_rating_values.ratingValues FROM  product_rating_values LEFT JOIN product ON product_rating_values.product_id =  product.id WHERE product.quantity >0 ORDER BY product_rating_values.ratingValues DESC LIMIT 4";
  db.executeQuery(sql, null, function (result) {
    callback(result);
  });
};
//////////end get popular products by ratng////////
var getPopularProductsByIdNum = (callback) => {
  var sql = "SELECT * FROM product ORDER BY id DESC LIMIT 4";
  db.executeQuery(sql, null, function (result) {
    callback(result);
  });
};
/////////////product colour////////
var createProductColor = (product, callback) => {
  var sql = "INSERT INTO  color VALUES(null, ?, ?, ?)";
  db.executeQuery(
    sql,
    [
      product.product_id,
      // product.user_id,
      product.date,
      product.colourName
    ],
    function (result) {
      callback(result);
    }
  );
};
var updateProductColor = (id, product, callback) => {
  var sql =
    "UPDATE color SET product_id =?,date = ?, colourName = ? WHERE id = ?";
  db.executeQuery(sql,[product.product_id,product.date,product.colourName,id],
    function (result) {
      callback(result);
    }
  );
};

var getAllProductColour = (prcolour,callback) => {
  var sql =
    "SELECT * FROM color WHERE product_id=? ORDER BY id DESC";
  // var sql = "SELECT * FROM product CROSS JOIN category";
  db.executeQuery(sql, [prcolour], function (result) {
    callback(result);
  });
};
var deleteProductColor = (id, callback) => {
  var sql = "DELETE FROM color WHERE id = ?";
  db.executeQuery(sql, [id], function (result) {
    callback(result);
  });
};
////////////end product colour////
/////////////product size////////
var createProductSize = (product, callback) => {
  var sql = "INSERT INTO  size VALUES(null, ?, ?, ?, ?)";
  db.executeQuery(
    sql,
    [
      product.product_id,
      // product.user_id,
      product.date,
      product.sizeName
    ],
    function (result) {
      callback(result);
    }
  );
};
var updateProductSize = (id, product, callback) => {
  var sql =
    "UPDATE size SET product_id =?,date = ?, sizeName = ? WHERE id = ?";
  db.executeQuery(sql,[product.product_id,product.date,product.sizeName,id],
    function (result) {
      callback(result);
    }
  );
};

var getAllProductSize = (prodSize,callback) => {
  var sql =
    "SELECT * FROM size WHERE product_id=? ORDER BY id DESC";
  // var sql = "SELECT * FROM product CROSS JOIN category";
  db.executeQuery(sql, [prodSize], function (result) {
    callback(result);
  });
};
var deleteProductSize = (id, callback) => {
  var sql = "DELETE FROM size WHERE id = ?";
  db.executeQuery(sql, [id], function (result) {
    callback(result);
  });
};
////////////end product size////
/////////////product preview////////
var createProductPreview = (product, callback) => {
  var sql = "INSERT INTO  preview VALUES(null, ?, ?, ?, ?)";
  db.executeQuery(
    sql,
    [
      product.product_id,
      product.user_id,
      product.date,
      product.text
    ],
    function (result) {
      callback(result);
    }
  );
};
var updateProductPreview = (id, product, callback) => {
  var sql =
    "UPDATE preview SET date = ?, text = ? WHERE id = ?";
  db.executeQuery(sql,[product.date,product.text,id],
    function (result) {
      callback(result);
    }
  );
};

var getAllProductPreview = (prview_id,callback) => {
  // var sql = "SELECT * FROM preview WHERE product_id =? ORDER BY id DESC";
    var sql =
    "SELECT  users.firstName,users.lastName, users.profilePicture, preview.product_id,preview.user_id,preview.id,preview.text  FROM preview LEFT JOIN users ON preview.user_id = users.user_id WHERE preview.product_id = ? ORDER BY preview.id DESC";

  // var sql = "SELECT * FROM product CROSS JOIN category";
  db.executeQuery(sql, [prview_id], function (result) {
    callback(result);
  });
};
var deleteProductReview = (id, callback) => {
  var sql = "DELETE FROM preview WHERE id = ?";
  db.executeQuery(sql, [id], function (result) {
    callback(result);
  });
};
var deleteProductReview = (id, callback) => {
  var sql = "DELETE FROM preview WHERE id = ?";
  db.executeQuery(sql, [id], function (result) {
    callback(result);
  });
};
////////////end product preview////

/////////////coupon////////
var createCoupon = (coupon, callback) => {
  var sql = "INSERT INTO  coupon VALUES(null, ?, ?, ?, ?)";
  db.executeQuery(
    sql,
    [
      coupon.code,
      coupon.firstDate,
      coupon.endDate,
      coupon.percentage
    ],
    function (result) {
      callback(result);
    }
  );
};
var updateCoupon = (id, coupon, callback) => {
  var sql =
    "UPDATE coupon SET code =?,firstDate = ?, endDate = ?, percentage = ? WHERE id = ?";
  db.executeQuery(sql,[coupon.code,coupon.firstDate,coupon.endDate,coupon.percentage,id],
    function (result) {
      callback(result);
    }
  );
};

var getAllCoupon = (callback) => {
  var sql =
    "SELECT * FROM coupon ORDER BY id DESC";
  // var sql = "SELECT * FROM product CROSS JOIN category";
  db.executeQuery(sql,null, function (result) {
    callback(result);
  });
};
var deleteCoupon = (id, callback) => {
  var sql = "DELETE FROM coupon WHERE id = ?";
  db.executeQuery(sql, [id], function (result) {
    callback(result);
  });
};
var deleteAllCoupon = (callback) => {
  var sql = "DELETE FROM coupon";
  db.executeQuery(sql,null, function (result) {
    callback(result);
  });
};
var checkCouponCode = (code, callback) => {
  var sql = "SELECT percentage FROM coupon WHERE code = ?";
  db.executeQuery(sql, [code], function (result) {
    callback(result);
  });
};
////////////end coupon////
var getAllProductsImages = (callback) => {
  var sql =
    "SELECT product.Name,product.uploadedBy,product.quantity,product.totalRate, product.id, product.color, product.size, product.Code,product.Description, product.Price,productphotos.photoId , productphotos.product_image,category.catagory_Name FROM product LEFT JOIN category ON product.Category_id = category.id LEFT JOIN productphotos ON productphotos.product_id = product.id ORDER BY product.id DESC";
  // var sql = "SELECT * FROM product CROSS JOIN category";
  db.executeQuery(sql, null, function (result) {
    callback(result);
  });
};
var productNameByCatagoryID = (cid, callback) => {
  // var sql = "SELECT * FROM product WHERE Name LIKE ?";
  var sql = "SELECT catagory_Name FROM category WHERE id = ?";
  db.executeQuery(sql, [cid], function (resultc1) {
    callback(resultc1[0]);
  });
};
var getProductByCategoryID = (productName, callback) => {
  var sql = "SELECT * FROM product WHERE Name LIKE ?";
  // var sql = "SELECT catagory_Name FROM product WHERE id = ?";
  db.executeQuery(sql, [productName], function (resultc2) {
    callback(resultc2);
  });
};
var searchProductsName = (productName, callback) => {
  var sql = "SELECT * FROM product WHERE Name LIKE ?";
  // var sql = "SELECT catagory_Name FROM product WHERE id = ?";
  db.executeQuery(sql, [productName], function (resultc2) {
    callback(resultc2);
  });
};
// var categoryIDByCatagoryName = (catagoryNames, callback) => {
//   // var sql = "SELECT * FROM product WHERE Name LIKE ?";
//   var sql = "SELECT id FROM category WHERE catagory_Name LIKE ?";
//   db.executeQuery(sql, [catagoryNames], function (resultc1) {
//     callback(resultc1[0]);
//   });
// };
var updateProductRate = (data, totalRate, callback) => {
  var sql =
    "UPDATE product SET totalRate = ? WHERE id = ?";
  db.executeQuery(sql,[ totalRate,data.product_id],
    function (result) {
      callback(result);
    }
  );
};
var getPurchasedProducts = (fullDate,userId,callback) => {
  var sql =
    "SELECT product.Name,product.uploadedBy,product.quantity,product.totalRate, product.id, product.color, product.size, product.Code,product.Description, product.Price,purchasetable.orderID ,purchasetable.price,purchasetable.transaction_uuid	,orderhistory.status FROM product LEFT JOIN orderhistory ON product.id = orderhistory.product_id  LEFT JOIN purchasetable ON purchasetable.OrderID = orderhistory.OrderID WHERE orderhistory.status=1 AND purchasetable.date=? AND purchasetable.userID=? ORDER BY purchasetable.id DESC";
  db.executeQuery(sql, [fullDate,userId], function (result) {
    callback(result);
  });
};
module.exports = {
 
  updateProduct,
  deleteProduct,
  getAllProducts,
  getUserProducts,
  getProduct,
  productPhoto,
  productPhotoEdit,
  deleteProductPhoto,
  getAllProductPhoto,
  getProductPhoto,
  searchProducts,
  productByCatagory,
  getAllProductss,
  getProductImages,
  getProductId,
  totalProduct,
  yearlyProductsReport,
  monthlyProductsReport,
  weeklyProductsReport,
  dailyProductReport,
  getSimilarProducts,
  createPrRating,
  getAllProductRating,
  getRatingProducts,
  updatePrRating,
  getRatingByProductID,
  getPopulatedProducts,
  createProductColor,
  updateProductColor,
  getAllProductColour,
  deleteProductColor,
  createProductSize,
  updateProductSize,
  getAllProductSize,
  deleteProductSize,
  createProductPreview,
  updateProductPreview,
  getAllProductPreview,
  deleteProductReview,
  createCoupon,
  updateCoupon,
  getAllCoupon,
  deleteCoupon,
  deleteAllCoupon,
  getAllProductsImages,
  checkCouponCode,
  searchProductsByCategory,
  // productByCatagoryID,
  productNameByCatagoryID,
  getProductByCategoryID,
  getAllProductssA,
  getAllProductsssA,
  searchProductsName,
  getPopularProductsByRate,
  getPopularProductsByIdNum,
  productBySubCatagory,
  updateProductRate,
  getPurchasedProducts
  // productBySubCatagory2,
  // categoryIDByCatagoryName
};
