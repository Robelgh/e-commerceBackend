var express = require('express');
// var expressSession = require('express-session');
// require('dotenv').config();
var bodyParser = require('body-parser');
var app = express();
var port = 3000
var jwt = require('jsonwebtoken');
//to convert data to json and recieve request data from frontend
app.use(express.json());
//////////////cors start////
var cors = require('cors');
app.use(cors());
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
	});
// var corsOptions = {
///////////image start///////
path = require('path'),
////////////////////
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
////////////////////
fileUpload = require('express-fileupload');
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
const session = require('express-session');
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
//////////image end//////////
/////////payment controllers///////////
var paymentController = require('./controllers/paymentController');
app.use('/', paymentController);
/////////end paymentControllers///////
/////////chat controllers///////////
var smsChatController = require('./controllers/smsChatController');
app.use('/', smsChatController);
/////////end chatControllers///////
//common controllers
////////////////index controlller///////////
var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
/////////////////for google auth/////////////
var loginwithGoogleController = require('./controllers/loginwithGoogleController');
app.use('/', loginwithGoogleController);
////////////////for linkedin/////
var linkedinLoginController = require('./controllers/linkedinLoginController');
app.use('/', linkedinLoginController);
////////////////for facebook/////
var facebookLoginController = require('./controllers/facebookLoginController');
app.use('/', facebookLoginController);
////////////////end index controller////////
var Users = require('./controllers/UsersController');
var login = require('./controllers/loginController');
var logout = require('./controllers/logout');
//admin controllers
var admin = require('./controllers/adminController');
var products = require('./controllers/productsController');
/////////////admin//
app.use('/admin', admin);
///////////catatgory//
var catagory = require('./controllers/catagoryController');
app.use('/Catagory', catagory);
/////seller////////////
var seller = require('./controllers/sellerController');
app.use('/seller', seller);
////end seller/////////
//////////////profile///////////
var profile = require('./controllers/profileController');
app.use('/profile', profile);
//////////////end profile///////
//////whishinglist
var Wishlist = require('./controllers/WishlistController');
app.use('/Wishlist', Wishlist); 
////////Currency
var Currency = require('./controllers/currency')
app.use('/Currency', Currency);
/////////cart
var cart = require('./controllers/cartController');
app.use('/Cart', cart);
///////////repots////
var reports = require('./controllers/reportController');
//configure
app.set('view engine', 'ejs');
var nodemailer = require('nodemailer');
//middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'my top secret pass', resave: false, saveUninitialized: true }));
app.use('/css', express.static(__dirname + '/css'));
app.use('/images', express.static(__dirname + '/images'));
// NB:body-parser is used to handle form data.
//routes
app.use('/login', login);
app.use('/user', Users);
app.use('/logout', logout);
////////////////////////////////
//////////product routes///////
app.use('/product', products);
//server start
app.use('/reports', reports);
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
