var adminController = require('../controllers/admin');
var profileController = require('../controllers/profile');
var diaryController = require('../controllers/diary');

module.exports = function(app,passport){

    //========================================
  //HOME PAGE (with login links ============
  //========================================
  app.get('/',adminController.getHomePage);

  app.post('/login',adminController.login);
  app.get('/logout',adminController.logout);
  ////process forgot passowrd
  app.post('/forgot',adminController.forgot);

  //========================================
  //RESET PASSWORD PAGE ====================
  //========================================
  app.get('/reset/:token',adminController.showReset);

  app.post('/reset',adminController.resetPassword);


  //========================================
  //SIGNUP  ============================
  //========================================
  //process the signup form using custom callback with passport
  app.post('/signup',adminController.signup);

  //delete user by id
  app.delete('/user/:id',adminController.deleteUserById);

  //delete user by email
  app.delete('/userByEmail/:email',adminController.deleteUserByEmail);

  //========================================
  //PROFILE PAGE ===========================
  //========================================
  //this will have to be protected so we need to be logged in
  //use route middleware to verify
  app.get('/profile',isLoggedIn,profileController.getProfile);

  //make profile updates
  app.post('/profile',isLoggedIn,profileController.saveProfile);

  app.post('/entry',isLoggedIn,diaryController.saveEntry);

  //route middleware to check if user is logged in
  function isLoggedIn(req,res,next){
    console.log('checking auth');
    // if user is authenticated in the session, carry on
    if(req.isAuthenticated()){
      console.log('auth success');
      next();
    }else{
      console.log('not authorized');
      res.redirect('/');
    }
  }
};
