var db = require("../models/config");
var createPackaging = (id,product, callback) => {

    var sql="INSERT INTO packaging VALUES (null,?,?,?,?)"
    var sqlPP="INSERT INTO productpackaging VALUES (null,?,?)";
    db.executeQuery(sql,[product.Alive,product.Slaugther,product.Vacuum,product.Politain], function (result_p) {
        
         var packaging_id=result_p.insertId;
         var product_id=id[0].id;
        db.executeQuery(sqlPP, [product_id,packaging_id], function (result) {
          console.log(result)
        })
    })

}

var getpackage = (productID, callback) => {
    var sqlPackaginID="SELECT Packaging_id FROM productpackaging WHERE product_id=?"
    var sqlGetPackage="SELECT  alive, slaughter, vacuum, politain FROM `packaging` WHERE id=?"

    db.executeQuery(sqlPackaginID, [productID], function (result) {
        var package_id=result[0].Packaging_id;
        console.log("result from package id to get package"+package_id)

        db.executeQuery(sqlGetPackage, [package_id], function (result) {
            
            console.log("result from get delivery:")
            console.log(result)
            callback(result)
            console.log(".................................")
        })
    })
  
}
var editPackaging = (id,product, callback) => {

    var sqlPackaginID="SELECT Packaging_id FROM productpackaging WHERE product_id=?"
    var sqlUPackaging="UPDATE packaging SET alive=?,slaughter=?,vacuum=?,politain=? WHERE id=?"
    
    console.log("package result from model")
    console.log(id)
    console.log(product)

    db.executeQuery(sqlPackaginID, [id], function (result) {
        var package_id=result[0].Packaging_id;
        console.log("result from package id of product packaging")
        console.log(package_id)
    

        db.executeQuery(sqlUPackaging,[product.Alive,product.Slaugther,product.Vacuum,product.Politain,package_id],
            function (result) {
                callback(result);
            }
          );
    });
   
    
}
var deletePackaging = (id, callback) => {
    var sqlDP = "DELETE FROM packaging WHERE id = ?";
    var sqlPackaginID="SELECT Packaging_id FROM productpackaging WHERE product_id=?"
 

    db.executeQuery(sqlPackaginID, [id], function (result) {
        var package_id=result[0].Packaging_id;
        console.log(package_id)

    db.executeQuery(sqlDP, [package_id], function (result) {
    })
})
}
module.exports = {
    
    createPackaging,
    editPackaging,
    deletePackaging,
    getpackage
    
  };