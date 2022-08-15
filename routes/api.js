//common controllers
var Users = require('./controllers/UsersController');
var products = require('./controllers/productsController');
var catagory = require('./controllers/catagoryController');
var cart = require('./controllers/cartController');
var Wishlist = require('./controllers/WishlistController');
var currency = require('./controllers/currency')
var login = require('./controllers/loginController');
var logout = require('./controllers/logout');
var admin = require('./controllers/adminController');
//seller
var seller = require('./controllers/sellerController');
////end seller/////////
///////////repots////
var reports = require('./controllers/reportController');
///////////////profile////////
var profile = require('./controllers/profileController');
var smsChatController = require('./controllers/smsChatController');
app.use('/smsChatController', smsChatController);
var paymentController = require('./controllers/paymentController');
app.use('/', paymentController);
//routes
app.use('/login', login);
app.use('/user', Users);
app.use('/logout', logout);
app.use('/product', products);
app.use('/Catagory', catagory);
app.use('/Cart', cart);
app.use('/Wishlist', Wishlist);
app.use('/Currency', currency);
app.use('/admin', admin);
app.use('/seller', seller);
app.use('/profile', profile);
app.use('/reports', reports);
app.listen(port, () => {
    console.log(`Serverrrrrrrrr running on port ${port}`);
});
