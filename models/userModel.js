var db = require("../models/config");
var validateUser = (email, callback) => {
  var sql = "SELECT * FROM users WHERE email = ? ";
  db.executeQuery(sql, [email], function (result) {
    callback(result[0]); //calls back even if the functions are returned to the validateuser in login.js
  });
};

var createUser = (user, callback) => {
  var sql = "INSERT INTO users VALUES(null, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?)";
  db.executeQuery(
    sql,
    [
      user.firstName,
      user.lastName,
      user.phone,
      user.email,
      user.role,
      user.password,
      user.address,
      user.profilePicture,
      user.gender,
      user.activationCode,
      user.passCode,
      user.status,
      user.date,
      user.agreeStatus
    ],
    function (result) {
      callback(result);
    }
  );
};
///////////////////////////////////////
var getUser = (id, callback) => {
  var sql = "SELECT * FROM users WHERE user_id=?";
  db.executeQuery(sql, [id], function (result) {
    callback(result[0]);
  });
};
var getAllUser = (role, callback) => {
  var sql = "SELECT * FROM users WHERE role=?";
  db.executeQuery(sql, [role], function (result) {
    callback(result);
  });
};
var updateUserwithPhoto = (user_id, user, callback) => {
  var sql =
    "UPDATE users SET firstName = ?,lastName = ?, phone = ?,role = ?, address = ?,	profilePicture=?,status =?,date=? WHERE user_id = ?";
  db.executeQuery(
    sql,
    [
      user.firstName,
      user.lastName,
      user.phone,
      // user.email,
      user.role,
      user.address,
      user.profilePicture,
      // user.gender,
      user.status,
      user.date,
      user_id,
    ],
    function (result) {
      callback(result);
    }
  );
};

///update wih photo
var updateUser = (user_id, user, callback) => {
  var sql =
    "UPDATE users SET firstName = ?,lastName = ?, phone = ?,role = ?, address = ?,status =?,date=? WHERE user_id = ?";
  db.executeQuery(
    sql,
    [
      user.firstName,
      user.lastName,
      user.phone,
      // user.email,
      user.role,
      user.address,
      user.status,
      user.date,
      user_id,
    ],
    function (result) {
      callback(result);
    }
  );
};
////delete user
var deleteUser = (id, callback) => {
  var sql = "DELETE FROM users WHERE user_id = ?";
  db.executeQuery(sql, [id], function (result) {
    callback(result);
  });
};
//////change password
var updatePassword = (email, data, callback) => {
  var sql = "UPDATE users SET password = ?,passCode=? WHERE email = ?";
  db.executeQuery(sql, [data.newPassword, data.passCode, email], function (result) {
    callback(result);
  });
  // db.executeQuery(sql, [data.newPassword, email], function (result1) {
  //     callback(result1);
  // });
};
var EmailExists = (user, callback) => {
  // var sql = "INSERT INTO resetpassword VALUES(null, ?, ?)";
  var sql = "SELECT * FROM users WHERE email = ? AND activationCode = ?";
  db.executeQuery(sql, [user.email, user.activationCode], function (result1) {
    callback(result1);
  });
};
//////end
///////current password check
var passwordExists = (user, callback) => {
  // var sql = "INSERT INTO resetpassword VALUES(null, ?, ?)";
  var sql = "SELECT * FROM users WHERE email = ? AND passCode = ?";
  db.executeQuery(sql, [user.email, user.currentPassword], function (result1) {
    callback(result1);
  });
};
/////////////////////////
////sent text to gmail
var sentEmail = (user, callback) => {
  // var sql = "INSERT INTO resetpassword VALUES(null, ?, ?)";
  var sql = "UPDATE users SET activationCode = ? WHERE email = ?";
  db.executeQuery(sql, [user.activationCode, user.email], function (result) {
    callback(result);
  });
};
/////////////////end sent data to gmail/////

//////////change profile picture//////////
///////////////////////////////////////
var getProfile = (id, callback) => {
  var sql = "SELECT * FROM users WHERE user_id=?";
  db.executeQuery(sql, [id], function (result) {
    callback(result[0]);
  });
};
var getAllProfile = (user_id, callback) => {
  var sql =
    "SELECT user_id,firstName,lastName, phone, email, role, address, profilePicture, gender FROM users WHERE user_id = ?";
  db.executeQuery(sql, [user_id], function (result) {
    callback(result);
  });
};
var updateProfile = (user_id, user, callback) => {
  var sql =
    "UPDATE users SET firstName = ?,lastName = ?, phone = ?, email = ?,role = ?,password = ?, address = ?,profilePicture = ?, gender = ?,activationCode=?,passCode=?,status=? WHERE user_id = ?";
  db.executeQuery(
    sql,
    [
      user.firstName,
      user.lastName,
      user.phone,
      user.email,
      user.role,
      user.password,
      user.address,
      user.profilePicture,
      user.gender,
      user.activationCode,
      user.passCode,
      user.status,
      user_id,
    ],
    function (result) {
      callback(result);
    }
  );
};
////delete user
var deleteProfile = (id, callback) => {
  var sql = "DELETE FROM users WHERE user_id = ?";
  db.executeQuery(sql, [id], function (result) {
    callback(result);
  });
};
//////////end profilee////////////////////
////////seller///////////////
var createSeller = (user, callback) => {
  var sql = "INSERT INTO users VALUES(null, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?)";
  db.executeQuery(
    sql,
    [
      user.firstName,
      user.lastName,
      user.phone,
      user.email,
      user.role,
      user.password,
      user.address,
      user.profilePicture,
      user.gender,
      user.activationCode,
      user.passCode,
      user.status,
      user.date,
      user.agreeStatus
    ],
    function (result) {
      callback(result);
    }
  );
};
var getAllSellers = (role, callback) => {
  var sql =
    "SELECT user_id,firstName,lastName,phone,email,role,address,profilePicture,gender FROM users WHERE role = ? ORDER BY user_id DESC";
  db.executeQuery(sql, [role], function (result) {
    callback(result);
  });
};
/////////////end seller/////
/////////get codes/////////
var getCodes = (codes, callback) => {
  var sql = "SELECT activationCode FROM users WHERE activationCode=?";
  db.executeQuery(sql, [codes], function (result) {
    callback(result[0]);
  });
};
///////////end codes/////////
////update ststus//////////////
var updateStatus = (status, codes, callback) => {
  var sql = "UPDATE users SET status = ? WHERE activationCode = ?";
  db.executeQuery(sql, [status, codes], function (result) {
    callback(result);
  });
};
////////end update status//////
/////user and seller reports//////////
// var userReport = (callback) => {
//   var sql = "SELECT * FROM users";
//   db.executeQuery(sql, null, function (result) {
//     callback(result);
//   });
// };
// var sellerReport = (role, fullDate,callback) => {
//   var sql = "SELECT * FROM users WHERE role=? AND date=?";
//   db.executeQuery(sql, [role,fullDate], function (result) {
//     callback(result);
//   });
// };
var monthlysellerReport = (role, fullDate, callback) => {
  var sql = "SELECT * FROM users WHERE role=? AND date LIKE ? ";
  db.executeQuery(sql, [role, fullDate], function (result) {
    callback(result);
  });
};
var weeklysellerReport = (role, fullDate, callback) => {
  var sql = "SELECT * FROM users WHERE role=? AND date LIKE ? ";
  db.executeQuery(sql, [role, fullDate], function (result) {
    callback(result);
  });
};
var dailysellerReport = (role, datess, callback) => {
  var sql = "SELECT * FROM users WHERE role=? AND date LIKE ? ";
  db.executeQuery(sql, [role, datess], function (result) {
    callback(result);
  });
};

////////yearly
var yearlysellerReport = (years, role, callback) => {
  var sql = "SELECT * FROM users WHERE role=? AND date LIKE ?";
  db.executeQuery(sql, [role, years], function (result) {
    callback(result);
  });
};
//////end user and seller reports////

//////end reports////

//////total report//////////
var totalUsers = (role, callback) => {
  var sql = "SELECT COUNT(*) AS totalUsers FROM users WHERE role=?";
  db.executeQuery(sql, [role], function (result) {
    callback(result);
  });
};
var totalSellers = (role, callback) => {
  var sql = "SELECT COUNT(*) AS totalSellers FROM users WHERE role=?";
  db.executeQuery(sql, [role], function (result) {
    callback(result);
  });
};

////////end total reports///
var saveUser = (user, callback) => {
  var sql = "INSERT INTO users VALUES(null, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?)";
  db.executeQuery(sql, [user.firstName, user.lastName, user.phone, user.email, user.role, user.password, user.address, user.profilePicture, user.gender, user.activationCode, user.passCode, user.status, user.date], function (result) {
    callback(result);
  });
};
/////////getByEmail start///////
var getByEmailGoogle = (data, callback) => {
  var sql = "SELECT * FROM users WHERE email = ?";
  db.executeQuery(sql, [data.email], function (result) {
    callback(result[0]);
  });
};
/////////////////////////
/////////////////////////
////////end getByEmail LinkedIn/////////
var getByEmailLinkedIn = (data, callback) => {
  // var sql = "INSERT INTO resetpassword VALUES(null, ?, ?)";
  var sql = "SELECT * FROM users WHERE email = ? OR phone=?";
  // var sql = "SELECT * FROM users WHERE email = ?";
  db.executeQuery(sql, [data.email, data.phone], function (result) {
    callback(result[0]);
  });
};
/////////////////////////
////////end getByEmail LinkedIn/////////

////////////testimonial////////
var createTestimonial = (testimonial, callback) => {
  var sql = "INSERT INTO  testimonial VALUES(null, ?, ?, ?)";
  db.executeQuery(
    sql,
    [
      testimonial.name,
      testimonial.message,
      testimonial.date
    ],
    function (result) {
      callback(result);
    }
  );
};
var updateTestimonial = (id, testimonial, callback) => {
  var sql =
    "UPDATE testimonial SET name =?,message = ?, date = ? WHERE id = ?";
  db.executeQuery(sql, [testimonial.name, testimonial.message, testimonial.date, id],
    function (result) {
      callback(result);
    }
  );
};

var getAllTestimonial = (callback) => {
  var sql =
    "SELECT * FROM testimonial ORDER BY id DESC";
  // var sql = "SELECT * FROM product CROSS JOIN category";
  db.executeQuery(sql, null, function (result) {
    callback(result);
  });
};
var deleteTestimonial = (id, callback) => {
  var sql = "DELETE FROM testimonial WHERE id = ?";
  db.executeQuery(sql, [id], function (result) {
    callback(result);
  });
};
var deleteProfileImage = (user_id, callback) => {
  var profilePicture = "";
  var sql =
    "UPDATE users SET profilePicture = ? WHERE user_id = ?";
  db.executeQuery(
    sql,
    [
      profilePicture,
      user_id,
    ],
    function (result) {
      callback(result);
    }
  );
};
var getOrders = (seller_id, callback) => {
  var sql =
    "SELECT * FROM orderhistory WHERE uploadedBy = ? and status=2";
  db.executeQuery(sql, [seller_id], function (result) {
    callback(result);
  });
};
var getUserOrders = (seller_id, callback) => {
  var sql =
    "SELECT * FROM orderhistory WHERE user_id = ? and status=2";
  db.executeQuery(sql, [seller_id], function (result) {
    callback(result);
  });
};
var changePurchaseStatus = (status, id, callback) => {
  var sql =
    "UPDATE orderhistory SET status =? WHERE id = ?";
  db.executeQuery(sql, [status, id],
    function (result) {
      callback(result);
    }
  );
};
var getStatusByUserID = (uplodedBys, callback) => {
  var sql =
    "SELECT status FROM users WHERE user_id = ?";
  db.executeQuery(sql, [uplodedBys], function (result) {
    callback(result);
  });
};
var deleteorderhistory = (id, callback) => {
  var sql = "DELETE FROM orderhistory WHERE id = ?";
  db.executeQuery(sql, [id], function (result) {
    callback(result);
  });
};
var getUploadedBy = (id, callback) => {
  var sql =
    "SELECT uploadedBy FROM orderhistory WHERE id = ?";
  db.executeQuery(sql, [id], function (result) {
    callback(result);
  });
};
var getApprovedOrders = (seller_id, callback) => {
  var sql =
    "SELECT * FROM orderhistory WHERE uploadedBy = ? AND status=1";
  db.executeQuery(sql, [seller_id], function (result) {
    callback(result);
  });
};
var getApprovedUserOrders = (seller_id, callback) => {
  var sql =
    "SELECT * FROM orderhistory WHERE user_id = ? AND status=1";
  db.executeQuery(sql, [seller_id], function (result) {
    callback(result);
  });
};
var getActiveOrders = (seller_id, callback) => {
  var sql =
    "SELECT * FROM orderhistory WHERE uploadedBy = ? and status=0";
  db.executeQuery(sql, [seller_id], function (result) {
    callback(result);
  });
};
var getActiveUserOrders = (seller_id, callback) => {
  var sql =
    "SELECT * FROM orderhistory WHERE user_id = ? and status=0";
  db.executeQuery(sql, [seller_id], function (result) {
    callback(result);
  });
};
var createpurchase = (purchase, callback) => {
  var sql = "INSERT INTO  purchasetable VALUES(null, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)";
  db.executeQuery(
    sql,
    [
      purchase.userID,
      purchase.companyName,
      purchase.tinNumber,
      purchase.companyAddress,
      purchase.region,
      purchase.city,
      purchase.subCity,
      purchase.kebelle,
      purchase.postalCode,
      purchase.phoneNumber,
      purchase.orderID,
      purchase.price,
      purchase.vate,
      purchase.date,
      purchase.transaction_uuid,
    ],
    function (result) {
      callback(result);
    }
  );
};
var updatepurchase = (id, purchase, callback) => {
  var sql =
    "UPDATE purchasetable SET userID = ?,companyName = ?, tinNumber = ?,companyAddress = ?, region = ?,	city=?,subCity =?,kebelle=?,postalCode=?,phoneNumber=?,orderID=?,price=?,vate=?,date=? WHERE id = ?";
  db.executeQuery(
    sql,
    [
      purchase.userID,
      purchase.companyName,
      purchase.tinNumber,
      purchase.companyAddress,
      purchase.region,
      purchase.city,
      purchase.subCity,
      purchase.kebelle,
      purchase.postalCode,
      purchase.phoneNumber,
      purchase.orderID,
      purchase.price,
      purchase.vate,
      purchase.date,
      id
    ],
    function (result) {
      callback(result);
    }
  );
};

var createDocuments = (data, callback) => {
  var sql = "INSERT INTO documents VALUES(null, ?, ?, ?,?)";
  db.executeQuery(
    sql,
    [
      data.fileName,
      data.documentName,
      data.Description,
      data.date,
    ],
    function (result) {
      callback(result);
    }
  );
};
var updateDocuments = (data, documentID, callback) => {
  var sql =
    "UPDATE documents SET fileName = ?,documentName = ?, Description = ?,date=? WHERE id = ?";
  db.executeQuery(
    sql,
    [
      data.fileName,
      data.documentName,
      data.Description,
      data.date,
      documentID,
    ],
    function (result) {
      callback(result);
    }
  );
};
var deleteDocuments = (id, callback) => {
  var sql = "DELETE FROM documents WHERE id = ?";
  db.executeQuery(sql, [id], function (result) {
    callback(result);
  });
};
var getUserEmail = (callback) => {
  var sql = "SELECT * FROM users";
  db.executeQuery(sql, [null], function (result) {
    callback(result);
  });
};
var getDocuments = (documentName, callback) => {
  var sql = "SELECT * FROM documents WHERE documentName LIKE ?";
  db.executeQuery(sql, [documentName], function (result) {
    callback(result);
  });
};
var getAllDocuments = (callback) => {
  var sql = "SELECT * FROM documents";
  db.executeQuery(sql, [null], function (result) {
    callback(result);
  });
};
var getSingleDocument = (id, callback) => {
  var sql = "SELECT * FROM documents WHERE id = ?";
  db.executeQuery(sql, [id], function (result) {
    callback(result);
  });
};
var getSingleSeller = (id, callback) => {
  var sql = "SELECT * FROM users WHERE user_id = ? AND role=1";
  db.executeQuery(sql, [id], function (result) {
    callback(result);
  });
};
var getAllComments = (callback) => {
  var sql = "SELECT * FROM preview";
  db.executeQuery(sql, [null], function (result) {
    callback(result);
  });
};

module.exports = {
  validateUser,
  createUser,
  getProfile,
  getAllProfile,
  updateProfile,
  deleteProfile,
  getUser,
  updatePassword,
  sentEmail,
  updateUser,
  updateUserwithPhoto,
  // updatePassword,
  deleteUser,
  getAllUser,
  getAllSellers,
  createSeller,
  getCodes,
  updateStatus,
  // userReport,
  // sellerReport,
  monthlysellerReport,
  weeklysellerReport,
  yearlysellerReport,
  totalUsers,
  totalSellers,
  EmailExists,
  passwordExists,
  dailysellerReport,
  saveUser,
  getByEmailGoogle,
  getByEmailLinkedIn,
  createTestimonial,
  updateTestimonial,
  getAllTestimonial,
  deleteTestimonial,
  deleteProfileImage,
  getOrders,
  changePurchaseStatus,
  getStatusByUserID,
  deleteorderhistory,
  getUploadedBy,
  getActiveOrders,
  getApprovedOrders,
  getUserOrders,
  getActiveUserOrders,
  getApprovedUserOrders,
  createpurchase,
  updatepurchase,
  createDocuments,
  updateDocuments,
  deleteDocuments,
  getUserEmail,
  getDocuments,
  getAllDocuments,
  getSingleDocument,
  getSingleSeller,
  getAllComments
};
