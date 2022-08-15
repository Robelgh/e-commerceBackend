var express = require("express");
var router = express.Router(); //handles routing paths
var userModel = require("../models/userModel");
var cartModel = require("../models/cartModel");
var catagoryModel = require("../models/catagoryModel");
var productModel = require("../models/productModel");
var wishlistModel = require("../models/WishlistModel");
var validationRules = require("../validation_rules/rules");
var asyncValidator = require("async-validator-2");
const _ = require("lodash"); 
var authorization = require('../middlewares/authorization');
var sortBy= require('lodash/sortBy');
var fs = require('fs');
///////////////////////daly reports//////////
  router.get('/userReport',authorization.authenticateJWT, (req, res) => {
    let role =0;
    userModel.userReport(role, (result) => {
        if (!result) {
            res.status(200).json({ 'user': result });
        }
        else {
            console.log(result);
            res.status(200).json(result);
        }
    });
});
  ///////////end ///////////////
  ///////////////////sellers daily/////
router.get('/sellerReport',authorization.authenticateJWT, (req, res) => {
    let role =2;
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    // prints date & time in YYYY-MM-DD format
    let fullDate = year + "-" + month + "-" + date;
    console.log("all dates:"+fullDate);
    userModel.sellerReport(role, fullDate,(result) => {
        if (!result) {
            res.status(200).json({ 'seller': result });
        }
        else {
            // JSON.stringify
            let count=result.length;
            console.log(result);
            res.status(200).json(result,'total:'+count);
        }
    });
});
//////////seller delete///
////////////////////end daily reports//////
///////////start yearly report//////
router.post('/yearlysellerReport',authorization.authenticateJWT, (req, res) => {
    let role =2;
         if(req.body.year)
         {
            var  year=req.body.year;
            var years = "%" +year+ "%";
            console.log("exact years:"+years);
         }
         else{
            let ts = Date.now();
            let date_ob = new Date(ts);
            var year = date_ob.getFullYear();
             var years = "%" +year+ "%";
             console.log("now years:"+years);
         }
    userModel.yearlysellerReport(years,role,(result) => {
        if (!result) {
            res.status(200).json({ 'seller': result });
        }
        else {
            // console.log("all dates returned:"+fullDate);
            //////////////////////////////
     var months=["1","2","3","4","5","6","7","8","9","10","11","12"];
      var collectionss = [];
      var singlData=[];
      var count=0;
      /////////////////////split the month from date//////
      result.forEach((sets) => {
        // var allDatasts=sets.date.substring(5,6);
        let filOne=sets.date.split("-");
        console.log("splittedData:"+filOne[1]);
        var allDatasts=filOne[1];
            singlData.push({
                date: allDatasts,
                // monthName:months[monthID]
              });
        // }
        });
        ////////////end of split month from date/////
        ////////////////start of making unique////////////
              function removeDuplicates(data, key) {
  
               return [
             ...new Map(data.map(item => [key(item), item])).values()
             ]

            };
           var clean=removeDuplicates(singlData, item => item.date);
          console.log(removeDuplicates(singlData, item => item.date));
////////////////////////end of making unique//////////
/////////////////start of total data ////////
      clean.forEach((reslt) => 
      {
        var monthID=reslt.date;
      result.forEach((element) => {
        //   JSON.stringify(element);
        //   console.log("single ym:"+element.date.substring(0, 6));
        //   if(element.date.substring(5, 6)==reslt.date.substring(0,1))
        var firstDatt=element.date.split("-");
        // var secondDatt=reslt.date.split("-");
          console.log("single ym:"+firstDatt[1]);
      //   if(element.date.substring(7, 8)==reslt.date.substring(0,1))
      if(firstDatt[1]==reslt.date)
          {
          count++;
          }

      });
      collectionss.push({
        monthName:monthID,
        total: count
      });
      count=0;
///forloop
    })
    ///end forloop
    /////////start add to array for the reaining not existed on the list////
for(let i=0;i<months.length;i++)
{
  if(collectionss.some(code => code.monthName==months[i]))//return true if this month exists,false otherwise
  {

  }
   else{
    collectionss.push({
        monthName:months[i],
        total:0
    })
}
}
    ////////////end add to array///
    var ses=collectionss.sort(function(a, b) {
      return parseFloat(a.monthName) - parseFloat(b.monthName);
  });
      return res.status(200).json(ses);
      // return res.status(200).json(collectionss);
        }
    });
//  } ///month loop
});
///////////end yearly report///////
///////////start monthly report//////
router.post('/monthlysellerReport',authorization.authenticateJWT, (req, res) => {
    let role =2;

    if(req.body.month)
    {
       var  month=req.body.month;
       var year =req.body.year;
       var monthss = "%"+year+"-"+month+"%";
       var pMonth=month+","+year;
       console.log("exact month:"+monthss);
    }
    else{
       let ts = Date.now();
       let date_ob = new Date(ts);
       var year = date_ob.getFullYear();
       var month=date_ob.getMonth()+1;
       var monthss = "%"+year+"-"+month+"%";
        console.log("now months:"+monthss);
        var pMonth=month+","+year;
    }
    userModel.monthlysellerReport(role,monthss,(result) => {
        if (!result) {
            res.status(200).json({ 'seller': result });
        }
        else {
            // console.log("all dates returned:"+fullDate);
            //////////////////////////////
            var dayNames=["Mondays","Tuesdays","Wednesdays","Thursdays","Fridays","Saturdays","Sundays"];
     var days=["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"];
      var collectionss = [];
      var singlData=[];
      var count=0;
      /////////////////////split the day from date//////
      result.forEach((sets) => {
        // var allDatasts=sets.date.substring(7,8);
        let filOne=sets.date.split("-");
        console.log("splittedData:"+filOne[2]);
        var allDatasts=filOne[2];
            singlData.push({
                date: allDatasts,
                // monthName:days[monthID]
              });
        // }
        });
        ////////////end of split day from date/////
        ////////////////start of making unique////////////
function removeDuplicates(data, key) {
  
  return [
    ...new Map(data.map(item => [key(item), item])).values()
  ]

};
var clean=removeDuplicates(singlData, item => item.date);
console.log(removeDuplicates(singlData, item => item.date));
////////////////////////end of making unique//////////
/////////////////start of total data ////////
      clean.forEach((reslt) => 
      {
        var monthID=reslt.date;
        // var monthID=reslt.date.substring(0,1);
      result.forEach((element) => {
        //   JSON.stringify(element);
        //   console.log("single ym:"+element.date.substring(0, 6));
          var firstDatt=element.date.split("-");
          // var secondDatt=reslt.date.split("-");
            console.log("single ym:"+firstDatt[2]);
        //   if(element.date.substring(7, 8)==reslt.date.substring(0,1))
        if(firstDatt[2]==reslt.date)
          {
          count++;
          }

      });
      collectionss.push({
        date:monthID,
        total: count
      });
      count=0;
///forloop
    })
    ///end forloop
    /////////start add to array for the reaining not existed on the list////
for(let i=0;i<days.length;i++)
{
  if(collectionss.some(code => code.date==days[i]))//return true if this day exists,false otherwise
  {

  }
   else{
    collectionss.push({
       date: days[i],
       total:0
    })
}
}
    ////////////end add to array///
    var ses=collectionss.sort(function(a, b) {
      return parseFloat(a.date) - parseFloat(b.date);
  });
      return res.status(200).json(ses);
      
        }
    });
//  } ///month loop
});
///////////end monthly report///////
///////////start weekly report//////
router.post('/weeklysellerReport',authorization.authenticateJWT, (req, res) => {
    let role =2;

       let ts = Date.now();
       let date_ob = new Date(ts);
       var year = date_ob.getFullYear();
       var month=date_ob.getMonth()+1;
       var date=date_ob.getDate();
       var monthss = "%"+year+"-"+month+"%";
        console.log("now months:"+monthss+date);

    userModel.weeklysellerReport(role,monthss,(result) => {
        if (result.length==0) {
            res.status(200).json( result );
        }
        else {
            // var dayNames=["Mondays","Tuesdays","Wednesdays","Thursdays","Fridays","Saturdays","Sundays"];
            var days=[];
            for(let i=1;i<=7;i++)
            {
                if(date-i+1<=0)
                {
                   days.push(date-i+30);
                }
                
                else{
                days.push(date-i+1);
                }
                
            }
            for(let j=0;j<days.length;j++)
            {
                console.log("all 7 days"+days[j])
            }
      var collectionss = [];
      var singlData=[];
      var collect;
      var count=0;
      /////////////////////split the day from date//////
      result.forEach((sets) => {
        // var allDatasts=sets.date.substring(7,8);
        let filOne=sets.date.split("-");
        console.log("splittedData:"+filOne[2]);
        var allDatasts=filOne[2];
            singlData.push({
                date: allDatasts,
                // monthName:days[monthID]
              });
        // }
        });
        ////////////end of split day from date/////
        ////////////////start of making unique////////////
function removeDuplicates(data, key) {
  
  return [
    ...new Map(data.map(item => [key(item), item])).values()
  ]

};
var clean=removeDuplicates(singlData, item => item.date);
console.log(removeDuplicates(singlData, item => item.date));
////////////////////////end of making unique//////////
/////////////////start of total data ////////
      clean.forEach((reslt) => 
      {
        var dateID=reslt.date;
        console.log("dayId:"+dateID)
        // var dateID=reslt.date.substring(0,1);
      result.forEach((element) => {
        //   JSON.stringify(element);
        //   console.log("single ym:"+element.date.substring(0, 6));
          var firstDatt=element.date.split("-");
          // var secondDatt=reslt.date.split("-");
            console.log("single ym:"+firstDatt[2]);
            console.log("seconddate:"+reslt.date);
        //   if(element.date.substring(7, 8)==reslt.date.substring(0,1))
        if(firstDatt[2]==reslt.date)
          {
          count++;

          }

      });
      // if(!days[dateID])
      // {
        // console.log("singlecompare:"+firstDatt[2]);
        console.log("seconddatecompare:"+reslt.date);
        console.log("count:"+count)
      // }
      // else{
      collectionss.push({
        date:dateID,
        total: count
      });
      ////////////////
      collectionss.forEach((element) => {
        console.log("dataw:"+element.date);
      })
      ///////////////
    // }
      count=0;
      collect=collectionss;
///forloop
    })
    ///end forloop
    /////////start add to array for the reaining not existed on the list////
for(let i=0;i<days.length;i++)
{
  if(collect.some(code => code.date==days[i]))//return true if this day exists,false otherwise
  {
  
  }
   else{
    collectionss.push({
      date:days[i],
      total:0
  })
}
}
    ////////////end add to array///
    var ses=collectionss.sort(function(a, b) {
      return parseFloat(a.date) - parseFloat(b.date);
  });
  /////////////////////////////
  ////////////////////////////
      return res.status(200).json(ses);
      // return res.status(200).json(collectionss);
        }
    });
//  } ///month loop
});
///////////end weekly report///////
///////////start daily report//////
router.post('/dailysellerReport',authorization.authenticateJWT, (req, res) => {
    let role =2;
       let ts = Date.now();
       let date_ob = new Date(ts);
       var year = date_ob.getFullYear();
       var month=date_ob.getMonth()+1;
       var date=date_ob.getDate();
       var hours=date_ob.getHours();
       var datess = "%"+year+"-"+month+"-"+date+"%";
        console.log("now months:"+year+"-"+month+"-"+date+"-"+hours);
        var hourss=["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24"];
        var collectionss = [];
        var singlData=[];
        var count=0;
    userModel.dailysellerReport(role,datess,(result) => {
        if (result.length==0) {
            for(let i=0;i<hourss.length;i++)
            {
      collectionss.push({
          hourName:hourss[i],
          total:0
         })
         }
         res.status(200).json(collectionss);
        }
        else {
            // console.log("all dates returned:"+fullDate);
      /////////////////////split the day from date//////
      result.forEach((sets) => {
        let filOne=sets.date.split("-");
        console.log("splittedData:"+filOne[3]);
        var allDatasts=filOne[3];
        // var allDatasts=sets.date.substring(9,10);
            singlData.push({
                date: allDatasts,
                // monthName:hourss[monthID]
              });
            //   console.log(data[0])
        // }
        });
        ////////////end of split hour from date/////
        ////////////////start of making unique////////////
function removeDuplicates(data, key) {
  
  return [
    ...new Map(data.map(item => [key(item), item])).values()
  ]

};
var clean=removeDuplicates(singlData, item => item.date);
console.log(removeDuplicates(singlData, item => item.date));
////////////////////////end of making unique//////////
/////////////////start of total data ////////
      clean.forEach((reslt) => 
      {
        var hourID=reslt.date;
        console.log("exact dates:"+hourID)
        //////////////////////////////
        //////////////////////////////
      result.forEach((element) => {
        //   JSON.stringify(element);
        var firstDatt=element.date.split("-");
        // var secondDatt=reslt.date.split("-");
          console.log("single ym:"+firstDatt[3]);
        //   if(element.date.substring(9, 10)==reslt.date.substring(0,1))
          if(firstDatt[3]==reslt.date)
          {
          count++;
          }

      });
      collectionss.push({
        hourName:hourID,
        total: count
      });
      count=0;
///forloop
    })
    ///end forloop
    /////////start add to array for the reaining not existed on the list////
for(let i=0;i<hourss.length;i++)
{
  if(collectionss.some(code => code.hourName==hourss[i]))//return true if this day exists,false otherwise
  {

  }
   else{
    collectionss.push({
        hourName:hourss[i],
        total:0
    })
}
}
    ////////////end add to array///
    var ses=collectionss.sort(function(a, b) {
      return parseFloat(a.hourName) - parseFloat(b.hourName);
  });
      return res.status(200).json(ses);
      // return res.status(200).json(collectionss);
        }
    });
//  } ///hours loop
});
///////////end daily report///////

/////////////////general report///////////
// router.get('/totalUsers',authorization.authenticateJWT, (req, res) => {
//     var role=0;
//     userModel.totalUsers(role,(result) => {
//         if (result.length == 0) {
//             res.status(200).json({ 'totalusers': result });
//         }
//         else {
//             res.status(200).json({ 'totalUsers':result });
//         }
//     });
// });
router.get('/totalUsers',authorization.authenticateJWT, (req, res) => {
    var role=0;
    userModel.totalUsers(role,(result) => {
        if (result.length == 0) {
            res.status(200).json({ 'totalusers': result });
        }
        else {
          // for(let i=0;i<result.length;i++)
          // {
          // console.log("totalUsers1:"+JSON.stringify(result[0].totalUsers))
          // }
            res.status(200).json(result );
        }
    });
});
router.get('/totalSellers',authorization.authenticateJWT, (req, res) => {
    var role=2;
    userModel.totalSellers(role,(result) => {
        if (result.length == 0) {
            res.status(200).json({ 'totalSellers': result });
        }
        else {
            res.status(200).json({ 'totalSellers':result });
        }
    });
});
router.get('/totalProduct',authorization.authenticateJWT, (req, res) => {
    productModel.totalProduct((result) => {
        if (result.length == 0) {
            res.status(200).json({ 'totalProduct': result });
        }
        else {
            res.status(200).json({ 'totalProduct':result });
        }
    });
});
router.get('/totalCatagory',authorization.authenticateJWT, (req, res) => {
    catagoryModel.totalCatagory((result) => {
        if (result.length == 0) {
            res.status(200).json({ 'totalCatagory': result });
        }
        else {
            res.status(200).json({ 'totalCatagory':result });
        }
    });
});
///////////end ///////////////
////////////////end general report////////
////////////////users summary Report//////////
///////////start yearly report//////
router.post('/yearlyUsersReport',authorization.authenticateJWT, (req, res) => {
    let role =0;
         if(req.body.year)
         {
            var  year=req.body.year;
            var years = "%" +year+ "%";
            console.log("exact years:"+years);
         }
         else{
            let ts = Date.now();
            let date_ob = new Date(ts);
            var year = date_ob.getFullYear();
             var years = "%" +year+ "%";
             console.log("now years:"+years);
         }
    userModel.yearlysellerReport(years,role,(result) => {
        if (result.length==0) {
            res.status(200).json(result );
        }
        else {
            // console.log("all dates returned:"+fullDate);
            //////////////////////////////
    //  var months=["January","February","March","April","May","June","July","August","September","October","November","December"];
    var months=["1","2","3","4","5","6","7","8","9","10","11","12"];
      var collectionss = [];
      var singlData=[];
      var count=0;
      /////////////////////split the month from date//////
      result.forEach((sets) => {
        // var allDatasts=sets.date.substring(5,6);
        let filOne=sets.date.split("-");
        console.log("splittedData:"+filOne[1]);
        var allDatasts=filOne[1];
            singlData.push({
                date: allDatasts,
                // monthName:months[monthID]
              });
        // }
        });
        ////////////end of split month from date/////
        ////////////////start of making unique////////////
function removeDuplicates(data, key) {
  
  return [
    ...new Map(data.map(item => [key(item), item])).values()
  ]

};
var clean=removeDuplicates(singlData, item => item.date);
console.log(removeDuplicates(singlData, item => item.date));
////////////////////////end of making unique//////////
/////////////////start of total data ////////
      clean.forEach((reslt) => 
      {
        var monthID=reslt.date;
      result.forEach((element) => {
        //   JSON.stringify(element);
        //   console.log("single ym:"+element.date.substring(0, 6));
        //   if(element.date.substring(5, 6)==reslt.date.substring(0,1))
        var firstDatt=element.date.split("-");
        // var secondDatt=reslt.date.split("-");
          console.log("single ym:"+firstDatt[1]);
      //   if(element.date.substring(7, 8)==reslt.date.substring(0,1))
      if(firstDatt[1]==reslt.date)
          {
          count++;
          }

      });
      collectionss.push({
        monthName:monthID,
        total: count
      });
      count=0;
///forloop
    })
    ///end forloop
    /////////start add to array for the reaining not existed on the list////
for(let i=0;i<months.length;i++)
{
  if(collectionss.some(code => code.monthName==months[i]))//return true if this month exists,false otherwise
  {

  }
   else{
    collectionss.push({
        monthName:months[i],
        total:0
    })
}
}
    ////////////end add to array///
    var ses=collectionss.sort(function(a, b) {
      return parseFloat(a.monthName) - parseFloat(b.monthName);
  });
      return res.status(200).json(ses);
      // return res.status(200).json(collectionss);
        }
    });
//  } ///month loop
});
///////////end yearly report///////
///////////start monthly report//////
router.post('/monthlyUsersReport',authorization.authenticateJWT, (req, res) => {
    let role =0;

    if(req.body.month)
    {
       var  month=req.body.month;
       var year =req.body.year;
       var monthss = "%"+year+"-"+month+"%";
       var pMonth=month+","+year;
       console.log("exact month:"+monthss);
    }
    else{
       let ts = Date.now();
       let date_ob = new Date(ts);
       var year = date_ob.getFullYear();
       var month=date_ob.getMonth()+1;
       var monthss = "%"+year+"-"+month+"%";
        console.log("now months:"+monthss);
        var pMonth=month+","+year;
    }
    userModel.monthlysellerReport(role,monthss,(result) => {
        if (!result) {
            res.status(200).json( result );
        }
        else {
            // console.log("all dates returned:"+fullDate);
            //////////////////////////////
            var dayNames=["Mondays","Tuesdays","Wednesdays","Thursdays","Fridays","Saturdays","Sundays"];
     var days=["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"];
      var collectionss = [];
      var singlData=[];
      var count=0;
      /////////////////////split the day from date//////
      result.forEach((sets) => {
        // var allDatasts=sets.date.substring(7,8);
        let filOne=sets.date.split("-");
        console.log("splittedData:"+filOne[2]);
        var allDatasts=filOne[2];
            singlData.push({
                date: allDatasts,
                // monthName:days[monthID]
              });
        // }
        });
        ////////////end of split day from date/////
        ////////////////start of making unique////////////
function removeDuplicates(data, key) {
  
  return [
    ...new Map(data.map(item => [key(item), item])).values()
  ]

};
var clean=removeDuplicates(singlData, item => item.date);
console.log(removeDuplicates(singlData, item => item.date));
////////////////////////end of making unique//////////
/////////////////start of total data ////////
      clean.forEach((reslt) => 
      {
        var monthID=reslt.date;
        // var monthID=reslt.date.substring(0,1);
      result.forEach((element) => {
        //   JSON.stringify(element);
        //   console.log("single ym:"+element.date.substring(0, 6));
          var firstDatt=element.date.split("-");
          // var secondDatt=reslt.date.split("-");
            console.log("single ym:"+firstDatt[2]);
        //   if(element.date.substring(7, 8)==reslt.date.substring(0,1))
        if(firstDatt[2]==reslt.date)
          {
          count++;
          }

      });
      collectionss.push({
        // date:dayNames[days[monthID]],
        date:monthID,
        total: count
      });
      count=0;
///forloop
    })
    ///end forloop
    /////////start add to array for the reaining not existed on the list////
for(let i=0;i<days.length;i++)
{
  if(collectionss.some(code => code.date==days[i]))//return true if this day exists,false otherwise
  {

  }
   else{
    collectionss.push({
        date:days[i],
        total:0
    })
}
}
    ////////////end add to array///
    var ses=collectionss.sort(function(a, b) {
      return parseFloat(a.date) - parseFloat(b.date);
  });
      return res.status(200).json(ses);
      // return res.status(200).json(collectionss);
        }
    });
//  } ///month loop
});
///////////end monthly report///////
///////////start weekly report//////
router.post('/weeklyUsersReport',authorization.authenticateJWT, (req, res) => {
    let role =0;

       let ts = Date.now();
       let date_ob = new Date(ts);
       var year = date_ob.getFullYear();
       var month=date_ob.getMonth()+1;
       var date=date_ob.getDate();
       var monthss = "%"+year+"-"+month+"%";
        console.log("now months:"+monthss);

    userModel.weeklysellerReport(role,monthss,(result) => {
        if (result.length==0) {
            res.status(200).json(result );
        }
        else {
            var days=[];
            for(let i=1;i<=7;i++)
            {
                if(date-i+1<=0)
                {
                   days.push(date-i+30);
                }
                
                else{
                days.push(date-i+1);
                }
                
            }
            for(let j=0;j<days.length;j++)
            {
                console.log("all 7 days"+days[j])
            }
      var collectionss = [];
      var singlData=[];
      var count=0;
      /////////////////////split the day from date//////
      result.forEach((sets) => {
        // var allDatasts=sets.date.substring(7,8);
        let filOne=sets.date.split("-");
        console.log("splittedData:"+filOne[2]);
        var allDatasts=filOne[2];
            singlData.push({
                date: allDatasts,
                // monthName:days[monthID]
              });
        // }
        });
        ////////////end of split day from date/////
        ////////////////start of making unique////////////
function removeDuplicates(data, key) {
  
  return [
    ...new Map(data.map(item => [key(item), item])).values()
  ]

};
var clean=removeDuplicates(singlData, item => item.date);
console.log(removeDuplicates(singlData, item => item.date));
////////////////////////end of making unique//////////
/////////////////start of total data ////////
      clean.forEach((reslt) => 
      {
        var dateID=reslt.date;
        console.log("dayId:"+dateID)
        // var dateID=reslt.date.substring(0,1);
      result.forEach((element) => {
        //   JSON.stringify(element);
        //   console.log("single ym:"+element.date.substring(0, 6));
          var firstDatt=element.date.split("-");
          // var secondDatt=reslt.date.split("-");
            console.log("single ym:"+firstDatt[2]);
        //   if(element.date.substring(7, 8)==reslt.date.substring(0,1))
        if(firstDatt[2]==reslt.date)
          {
          count++;
          }

      });
      collectionss.push({
        date:dateID,
        total: count
      });
      count=0;
///forloop
    })
    ///end forloop
    /////////start add to array for the reaining not existed on the list////
for(let i=0;i<days.length;i++)
{
  if(collectionss.some(code => code.date==days[i]))//return true if this day exists,false otherwise
  {

  }
   else{
    collectionss.push({
        date:days[i],
        total:0
    })
}
}
    ////////////end add to array///
    var ses=collectionss.sort(function(a, b) {
      return parseFloat(a.date) - parseFloat(b.date);
  });
      return res.status(200).json(ses);
      // return res.status(200).json(collectionss);
        }
    });
//  } ///month loop
});
///////////end weekly report///////
///////////start daily report//////
router.post('/dailyUsersReport',authorization.authenticateJWT, (req, res) => {
    let role =0;
       let ts = Date.now();
       let date_ob = new Date(ts);
       var year = date_ob.getFullYear();
       var month=date_ob.getMonth()+1;
       var date=date_ob.getDate();
       var hours=date_ob.getHours();
       var datess = "%"+year+"-"+month+"-"+date+"%";
        console.log("now months:"+year+"-"+month+"-"+date+"-"+hours);
        var hourss=["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24"];
        var collectionss = [];
        var singlData=[];
        var count=0;
    userModel.dailysellerReport(role,datess,(result) => {
        if (result.length==0) {
            // res.status(200).json({ 'seller': result });
            for(let i=0;i<hourss.length;i++)
            {
      collectionss.push({
          hourName:hourss[i],
          total:0
         })
         }
         res.status(200).json(collectionss);
        }
        else {
            // console.log("all dates returned:"+fullDate);
            //////////////////////////////2021-4-5-12
            // var dayNames=["Mondays","Tuesdays","Wednesdays","Thursdays","Fridays","Saturdays","Sundays"];
    //  var hourss=["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24"];
    //   var collectionss = [];
    //   var singlData=[];
    //   var count=0;
    //   console.log("now months:"+result.date);
      /////////////////////split the day from date//////
      result.forEach((sets) => {
        let filOne=sets.date.split("-");
        console.log("splittedData:"+filOne[3]);
        var allDatasts=filOne[3];
        // var allDatasts=sets.date.substring(9,10);
            singlData.push({
                date: allDatasts,
                // monthName:hourss[monthID]
              });
            //   console.log(data[0])
        // }
        });
        ////////////end of split hour from date/////
        ////////////////start of making unique////////////
function removeDuplicates(data, key) {
  
  return [
    ...new Map(data.map(item => [key(item), item])).values()
  ]

};
var clean=removeDuplicates(singlData, item => item.date);
console.log(removeDuplicates(singlData, item => item.date));
////////////////////////end of making unique//////////
/////////////////start of total data ////////
      clean.forEach((reslt) => 
      {
        var hourID=reslt.date;
        console.log("exact dates:"+hourID)
        //////////////////////////////
        //////////////////////////////
      result.forEach((element) => {
        var firstDatt=element.date.split("-");
          console.log("single ym:"+firstDatt[3]);
          if(firstDatt[3]==reslt.date)
          {
          count++;
          }

      });
      collectionss.push({
        hourName:hourID,
        total: count
      });
      count=0;
///forloop
    })
    ///end forloop
    /////////start add to array for the reaining not existed on the list////
for(let i=0;i<hourss.length;i++)
{
  if(collectionss.some(code => code.hourName==hourss[i]))//return true if this day exists,false otherwise
  {

  }
   else{
    collectionss.push({
        hourName:hourss[i],
        total:0
    })
}
}
    ////////////end add to array///
    var ses=collectionss.sort(function(a, b) {
      return parseFloat(a.hourName) - parseFloat(b.hourName);
  });
      return res.status(200).json(ses);
      // return res.status(200).json(collectionss);
        }
    });
//  } ///hours loop
});
///////////end daily report///////
///////////////end Users Summary Reports//////

////////////////start product summary Report//////
///////////start yearly report//////
router.post('/yearlyProductsReport',authorization.authenticateJWT, (req, res) => {
    let role =0;
         if(req.body.year)
         {
            var  year=req.body.year;
            var years = "%" +year+ "%";
            console.log("exact years:"+years);
         }
         else{
            let ts = Date.now();
            let date_ob = new Date(ts);
            var year = date_ob.getFullYear();
             var years = "%" +year+ "%";
             console.log("now years:"+years);
         }
         productModel.yearlyProductsReport(years,(result) => {
        if (result.length==0) {
            res.status(200).json( result );
        }
        else {
            // console.log("all dates returned:"+fullDate);
            //////////////////////////////
    //  var months=["January","February","March","April","May","June","July","August","September","October","November","December"];
    var months=["1","2","3","4","5","6","7","8","9","10","11","12"];
      var collectionss = [];
      var singlData=[];
      var count=0;
      /////////////////////split the month from date//////
      result.forEach((sets) => {
        // var allDatasts=sets.date.substring(5,6);
        let filOne=sets.date.split("-");
        console.log("splittedData:"+filOne[1]);
        var allDatasts=filOne[1];
            singlData.push({
                date: allDatasts,
                // monthName:months[monthID]
              });
        // }
        });
        ////////////end of split month from date/////
        ////////////////start of making unique////////////
function removeDuplicates(data, key) {
  
  return [
    ...new Map(data.map(item => [key(item), item])).values()
  ]

};
var clean=removeDuplicates(singlData, item => item.date);
console.log(removeDuplicates(singlData, item => item.date));
////////////////////////end of making unique//////////
/////////////////start of total data ////////
      clean.forEach((reslt) => 
      {
        var monthID=reslt.date;
      result.forEach((element) => {
        var firstDatt=element.date.split("-");
          console.log("single ym:"+firstDatt[1]);
      if(firstDatt[1]==reslt.date)
          {
          count++;
          }

      });
      collectionss.push({
        monthName:monthID,
        total: count
      });
      count=0;
///forloop
    })
    ///end forloop
    /////////start add to array for the reaining not existed on the list////
for(let i=0;i<months.length;i++)
{
  if(collectionss.some(code => code.monthName==months[i]))//return true if this month exists,false otherwise
  {

  }
   else{
    collectionss.push({
        monthName:months[i],
        total:0
    })
}
}
    ////////////end add to array///
    var ses=collectionss.sort(function(a, b) {
      return parseFloat(a.monthName) - parseFloat(b.monthName);
  });
      return res.status(200).json(ses);
      // return res.status(200).json(collectionss);
        }
    });
//  } ///month loop
});
///////////end yearly report///////
///////////start monthly report//////
router.post('/monthlyProductsReport',authorization.authenticateJWT, (req, res) => {
    // let role =0;

    if(req.body.month)
    {
       var  month=req.body.month;
       var year =req.body.year;
       var monthss = "%"+year+"-"+month+"%";
       var pMonth=month+","+year;
       console.log("exact month:"+monthss);
    }
    else{
       let ts = Date.now();
       let date_ob = new Date(ts);
       var year = date_ob.getFullYear();
       var month=date_ob.getMonth()+1;
       var monthss = "%"+year+"-"+month+"%";
        console.log("now months:"+monthss);
        var pMonth=month+","+year;
    }
    productModel.monthlyProductsReport(monthss,(result) => {
        if (!result) {
            res.status(200).json( result );
        }
        else {
            // console.log("all dates returned:"+fullDate);
            //////////////////////////////
            var dayNames=["Mondays","Tuesdays","Wednesdays","Thursdays","Fridays","Saturdays","Sundays"];
     var days=["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"];
      var collectionss = [];
      var singlData=[];
      var count=0;
      /////////////////////split the day from date//////
      result.forEach((sets) => {
        // var allDatasts=sets.date.substring(7,8);
        let filOne=sets.date.split("-");
        console.log("splittedData:"+filOne[2]);
        var allDatasts=filOne[2];
            singlData.push({
                date: allDatasts,
                // monthName:days[monthID]
              });
        // }
        });
        ////////////end of split day from date/////
        ////////////////start of making unique////////////
function removeDuplicates(data, key) {
  
  return [
    ...new Map(data.map(item => [key(item), item])).values()
  ]

};
var clean=removeDuplicates(singlData, item => item.date);
console.log(removeDuplicates(singlData, item => item.date));
////////////////////////end of making unique//////////
/////////////////start of total data ////////
      clean.forEach((reslt) => 
      {
        var monthID=reslt.date;
        // var monthID=reslt.date.substring(0,1);
      result.forEach((element) => {
        //   JSON.stringify(element);
        //   console.log("single ym:"+element.date.substring(0, 6));
          var firstDatt=element.date.split("-");
          // var secondDatt=reslt.date.split("-");
            console.log("single ym:"+firstDatt[2]);
        //   if(element.date.substring(7, 8)==reslt.date.substring(0,1))
        if(firstDatt[2]==reslt.date)
          {
          count++;
          }

      });
      if(!days[monthID])
      {

      }
      collectionss.push({
        // date:dayNames[days[monthID]],
        date:monthID,
        total: count
      });
      count=0;
///forloop
    })
    ///end forloop
    /////////start add to array for the reaining not existed on the list////
for(let i=0;i<days.length;i++)
{
  if(collectionss.some(code => code.date==days[i]))//return true if this day exists,false otherwise
  {

  }
   else{
    collectionss.push({
        date:days[i],
        total:0
    })
}
}
    ////////////end add to array///
    var ses=collectionss.sort(function(a, b) {
      return parseFloat(a.date) - parseFloat(b.date);
  });
      return res.status(200).json(ses);
      // return res.status(200).json(collectionss);
        }
    });
//  } ///month loop
});
///////////end monthly report///////
///////////start weekly report//////
router.post('/weeklyProductsReport',authorization.authenticateJWT, (req, res) => {
    // let role =0;

      //  let ts = Date.now();
       let date_ob = new Date();
       var year = date_ob.getFullYear();
       var month=date_ob.getMonth()+1;
       var date=date_ob.getDate();
       var monthss = "%"+year+"-"+month+"%";
        console.log("todaysMonth:"+monthss);

        productModel.weeklyProductsReport(monthss,(result) => {
        if (result.length==0) {
            res.status(200).json(result );
        }
        else {
            // var dayNames=["Mondays","Tuesdays","Wednesdays","Thursdays","Fridays","Saturdays","Sundays"];
            var days=[];
            for(let i=1;i<=7;i++)
            {
                if(date-i+1<=0)
                {
                   days.push(date-i+30);
                }
                
                else{
                days.push(date-i+1);
                }
                
            }
            for(let j=0;j<days.length;j++)
            {
                console.log("all 7 days"+days[j])
            }
      var collectionss = [];
      var singlData=[];
      var count=0;
      /////////////////////split the day from date//////
      result.forEach((sets) => {
        // var allDatasts=sets.date.substring(7,8);
        let filOne=sets.date.split("-");
        console.log("splittedData:"+filOne[2]);
        var allDatasts=filOne[2];
            singlData.push({
                date: allDatasts,
                // monthName:days[monthID]
              });
        // }
        });
        ////////////end of split day from date/////
        ////////////////start of making unique////////////
function removeDuplicates(data, key) {
  
  return [
    ...new Map(data.map(item => [key(item), item])).values()
  ]

};
var clean=removeDuplicates(singlData, item => item.date);
console.log(removeDuplicates(singlData, item => item.date));
////////////////////////end of making unique//////////
/////////////////start of total data ////////
      clean.forEach((reslt) => 
      {
        var dateID=reslt.date;
        console.log("dayId:"+dateID)
        // var dateID=reslt.date.substring(0,1);
      result.forEach((element) => {
        //   JSON.stringify(element);
        //   console.log("single ym:"+element.date.substring(0, 6));
          var firstDatt=element.date.split("-");
          // var secondDatt=reslt.date.split("-");
            console.log("single ym:"+firstDatt[2]);
        //   if(element.date.substring(7, 8)==reslt.date.substring(0,1))
        if(firstDatt[2]==reslt.date)
          {
          count++;
          }

      });
      // if(!days[dateID])
      // {

      // }
      // else{
      collectionss.push({
        date:dateID,
        total: count
      });
    // }
      count=0;
///forloop
    })
    ///end forloop
    /////////start add to array for the reaining not existed on the list////
for(let i=0;i<days.length;i++)
{
  if(collectionss.some(code => code.date==days[i]))//return true if this day exists,false otherwise
  {

  }
   else{
    collectionss.push({
        date:days[i],
        total:0
    })
}
}
    ////////////end add to array///
    var ses=collectionss.sort(function(a, b) {
      return parseFloat(a.date) - parseFloat(b.date);
  });
      return res.status(200).json(ses);
      // return res.status(200).json(collectionss);
        }
    });
//  } ///month loop
});
///////////end weekly report///////
///////////start daily report//////
router.post('/dailyProductReport',authorization.authenticateJWT, (req, res) => {
    // let role =0;
       let ts = Date.now();
       let date_ob = new Date(ts);
       var year = date_ob.getFullYear();
       var month=date_ob.getMonth()+1;
       var date=date_ob.getDate();
       var hours=date_ob.getHours();
       var datess = "%"+year+"-"+month+"-"+date+"%";
        console.log("now months:"+year+"-"+month+"-"+date+"-"+hours);
        var hourss=["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24"];
        var collectionss = [];
        var singlData=[];
        var count=0;
        productModel.dailyProductReport(datess,(result) => {
        if (result.length==0) {
          /////////////////////
          for(let i=0;i<hourss.length;i++)
          {
    collectionss.push({
        hourName:hourss[i],
        total:0
       })
       }
          /////////////////////
            res.status(200).json(collectionss);
        }
        else {
            // console.log("all dates returned:"+fullDate);
            //////////////////////////////2021-4-5-12
            // var dayNames=["Mondays","Tuesdays","Wednesdays","Thursdays","Fridays","Saturdays","Sundays"];
    //   console.log("now months:"+result.date);
      /////////////////////split the day from date//////
      result.forEach((sets) => {
        let filOne=sets.date.split("-");
        console.log("splittedData:"+filOne[3]);
        var allDatasts=filOne[3];
        // var allDatasts=sets.date.substring(9,10);
            singlData.push({
                date: allDatasts,
                // monthName:hourss[monthID]
              });
            //   console.log(data[0])
        // }
        });
        ////////////end of split hour from date/////
        ////////////////start of making unique////////////
function removeDuplicates(data, key) {
  
  return [
    ...new Map(data.map(item => [key(item), item])).values()
  ]

};
var clean=removeDuplicates(singlData, item => item.date);
console.log(removeDuplicates(singlData, item => item.date));
////////////////////////end of making unique//////////
/////////////////start of total data ////////
      clean.forEach((reslt) => 
      {
        var hourID=reslt.date;
        console.log("exact dates:"+hourID)
        //////////////////////////////
        //////////////////////////////
      result.forEach((element) => {
        //   JSON.stringify(element);
        var firstDatt=element.date.split("-");
        // var secondDatt=reslt.date.split("-");
          console.log("single ym:"+firstDatt[3]);
        //   if(element.date.substring(9, 10)==reslt.date.substring(0,1))
          if(firstDatt[3]==reslt.date)
          {
          count++;
          }

      });
      collectionss.push({
        hourName:hourID,
        total: count
      });
      count=0;
///forloop
    })
    ///end forloop
    /////////start add to array for the reaining not existed on the list////
for(let i=0;i<hourss.length;i++)
{
  if(collectionss.some(code => code.hourName==hourss[i]))//return true if this day exists,false otherwise
  {

  }
   else{
    collectionss.push({
        hourName:hourss[i],
        total:0
    })
}
}
    ////////////end add to array///
    var ses=collectionss.sort(function(a, b) {
      return parseFloat(a.hourName) - parseFloat(b.hourName);
  });
      return res.status(200).json(ses);
      // return res.status(200).json(collectionss);
        }
    });
//  } ///hours loop
});
///////////end daily report///////
///////////////end product summary Rport//////////
module.exports = router;