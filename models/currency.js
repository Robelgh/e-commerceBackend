var db = require("../models/config");

var createCurrency = (data, callback) => {
    var sql="INSERT INTO currency VALUES (null,?,?,?)"
    console.log("data from create currency")
    

    db.executeQuery(
      sql,
      [data.currency_name, data.currency_value,data.currency_country],
      function (result) {
        console.log(result)
      }
    );
  };
  var getAllCurrency = (callback) => {
    var sql = "SELECT * FROM currency";

        db.executeQuery(sql, null, function (result) {
          callback(result)
        
        });
    
  };

  var deleteCurrency = (id, callback) => {
    var sql = "DELETE FROM currency WHERE id = ?";
    db.executeQuery(sql, [id], function (result) {
      callback(result);
    });
  };

  var updateCurrency = (id, newCurrency, callback) => {

    console.log("new currency")
    console.log(newCurrency)
    var sql =
      "UPDATE currency SET currency_name = ?,value = ?, country = ? WHERE id = ?";
    db.executeQuery(
      sql,
      [
        newCurrency.currency_name,
        newCurrency.currency_value,
        newCurrency.currency_country,
        id
      ],
      function (result) {
        callback(result);
      }
    );
  };
 
  module.exports = {
    
    createCurrency,
    updateCurrency,
    deleteCurrency,
    getAllCurrency
  };
