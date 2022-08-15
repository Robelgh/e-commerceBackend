var db = require("../models/config");
///////////////////////////////////////

var createProduct = (product, callback) => {
  console.log("product on delivery")
  console.log(product)

  var sql = "INSERT INTO  product VALUES(null, ?, ?, ?, ?, ?,?,?,?,?, ?,?,?,?,?,?,?)";
  var fobsql="INSERT INTO fob  VALUES (null, ?,?,?)";
  var cifsql="INSERT INTO cif VALUES (null,?,?)";
  var deliverysql="INSERT INTO delivery_method VALUES (null,?,?,?)";
  var sqldelivery_methodID="SELECT id FROM delivery_method ORDER BY id DESC LIMIT 1 "
  var sqlproductID="SELECT id FROM product ORDER BY id DESC LIMIT 1 "
  var productDeliverySQL="INSERT INTO productdelivery VALUES (null,?,?)";
  db.executeQuery(
    sql,
    [
      product.Category_id,
      product.Name,
      product.Description,
      product.Code,
      product.Price,
      product.age,
      product.weight,
      product.orgin,
      product.available,
      product.Image,
      product.uploadedBy,
      product.date,
      product.color,
      product.size,
      product.quantity,
      product.totalRate
    ],
    function (result_product) {
     console.log("//////product id//////");
      console.log(result_product.insertId)
     console.log("//////product id//////");

      if(result_product)
      {
        db.executeQuery(
          fobsql,
          [product.delivery.airport,product.delivery.djibouti,product.delivery.berbera],
          function (result_fob) {
            console.log("fob inserted id")
            console.log(result_fob.insertId)
          
            if(result_fob)
            {
              db.executeQuery(
                cifsql,
                [product.delivery.shipping,product.delivery.flight],
                function (result_cif) {
                   
                  console.log("cif inserted id")
                  console.log(result_cif.insertId)
                  
                   if(result_cif)
                   {
                    db.executeQuery(
                      deliverysql,
                      [result_fob.insertId,result_cif.insertId,product.delivery.GATE],
                      function (result_delivery) {

                        console.log("delivery method inserted id")
                        console.log(result_delivery.insertIdId)

                        
                        if(result_delivery)
                        {
                          console.log("//////delivery method id//////");
                          console.log(result_delivery.insertId)
                         console.log("//////product id//////");


                         db.executeQuery(
                          productDeliverySQL,
                          [result_product.insertId,result_delivery.insertId],
                          function (result_product_delivery) {

                            console.log("product delivery inserted id")
                            console.log(result_product_delivery.insertId.insertId)
                            
                            if(result_product_delivery)
                            {
                              console.log("success----product_delivery")
                            }
                          }
                        );
                        }
                      }
                    );
                   }
      
              
                   
                  
                   
                }
              );
            }
          
           
          }
        );
      }

      callback("success");
    
    }
    
  );
};

var getDelivery = (productID, callback) => {

  var deliveryID="SELECT delivery_id FROM productdelivery WHERE product_id=?"
  var delivery="SELECT `fob_id`, `cif_id`, `gate` FROM `delivery_method` WHERE id=?"
  var deliverySubCatagory="SELECT `airport`, `djibouti`, `berbera` FROM `fob` WHERE `fob_id`=?"
  var deliverySubCatagoryCIF="SELECT `shipping`, `flight` FROM `cif` WHERE `cif_id`=?"
  
   var deliveryobj={
         FOB:"",
         CIS:"",
         GATE:"",
   }
   var FOBobj=
   {
     airport:"",
     djibouti:"",
     berbera:"",

   }
   var CISobj=
   {
     shipping:"",
     flight:"",
   }
    db.executeQuery(deliveryID, [productID], function (result) {
      // callback(resultc1[0]);
      // callback("result")

      // console.log(result[0].delivery_id)
      var delivery_method_id=result[0].delivery_id

      if(result)
      {
        db.executeQuery(delivery,[delivery_method_id],function(resultD)
        {
           console.log(resultD[0]);
           deliveryobj.GATE=resultD[0].gate;

           if(resultD)
           {
             var FOB_id=resultD[0].fob_id
             var CIF_id=resultD[0].cif_id
             db.executeQuery(deliverySubCatagory,[FOB_id],function(resultFOB)
             {
               console.log(resultFOB)
              //  deliveryobj.FOB.push(

              //  )
             
             
              FOBobj.airport=resultFOB[0].airport,
              FOBobj.djibouti=resultFOB[0].djibouti,
              FOBobj.berbera=resultFOB[0].berbera,
               
               deliveryobj.FOB=FOBobj

               if(resultFOB)
               {
                  db.executeQuery(deliverySubCatagoryCIF,[CIF_id],function(resultCIF)
                  {
                    
                    CISobj.shipping=resultCIF[0].shipping,
                    CISobj.flight=resultCIF[0].flight,
                    
                     deliveryobj.CIS=CISobj
                     callback(deliveryobj)
                     
                  })  
               }

               

             })
           }
        })
     
        
      }
  
      
  
    });

                    
  

}


var deleteDelivery = (id, callback) => {
  var sqlDDM = "DELETE FROM delivery_method WHERE id = ?";
  var sqlDFOB = "DELETE FROM fob WHERE fob_id = ?";
  var sqlDCIF = "DELETE FROM cif WHERE cif_id = ?";
  var sqlDeliveryID="SELECT `delivery_id` FROM `productdelivery` WHERE product_id=?"
  var sqlFOBCIFID="SELECT `fob_id`, `cif_id` FROM `delivery_method` WHERE id=?"
  
  db.executeQuery(sqlDeliveryID, [id], function (result) {
    console.log("delivery id")
    console.log(result[0].delivery_id)
    var delivery_id=result[0].delivery_id;
    if(result)
    {
      db.executeQuery(sqlFOBCIFID, [delivery_id], function (result) {
        console.log("result fob cif")
        var fob_id=result[0].fob_id;
        var cif_id=result[0].cif_id;

        if(result)
        {
          db.executeQuery(sqlDFOB, [fob_id], function (result) {
               console.log(result)
          });
          db.executeQuery(sqlDCIF, [cif_id], function (result) {
               console.log(result)
          });
          db.executeQuery(sqlDDM, [delivery_id], function (result) {
               console.log(result)
          });
        }
        
      });
    }
  });

 
};






module.exports = {
    
    createProduct,
    getDelivery,
    deleteDelivery
    // getFOBId,
    // getCIFId,
    // createDeliveryTable,
  };
  