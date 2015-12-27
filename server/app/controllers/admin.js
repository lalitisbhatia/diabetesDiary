var async = require('async');
var crypto = require('crypto');
var q = require('q');
var passport = require('passport');
// async library to avoid dealing with nested callbacks by using with the help of async.waterfall method
var nodemailer = require('nodemailer');
var User = require('../../app/models/user.js');

var getHomePage = function(req,res,next){
  if(req.isAuthenticated()){
    console.log('********* REQ USER', req.user.local);
    console.log('user is authenticated');
    res.render('indexSubs.jade',{
      user:req.user // get the user out of session and pass to template
    })
  }else{
    console.log('calling home');
    var msg = req.flash('message') ; //.length>0?req.flash('message'):"test message";
    console.log(msg);
    res.render('index_.jade', { mesg: msg});
  }
};

var login = function(req,res,next){
  console.log('calling passport authenticate');
  passport.authenticate('local-login',function(err,user,info){
    console.log("err : " + err);
    console.log("user : " + user);
    console.log("info : " + info);
    console.log('inside custom callback');
    if (err) {
      console.log("Error: " + err);
      return next(err);
    }
    if (!user) {
      console.log(info);
      return res.send(info.message);
    }
    req.logIn(user, function(err) {
      //console.log(user);
      if (err) { return next(err); }
      console.log('userid = ',res.cookies);
      res.send({redirect:'/',auth:true,user:user});
    });
  })(req, res, next);
};

var logout = function(req,res){
  //console.log('calling logout');
  req.logout();
  res.redirect('/');
};

var forgot = function(req, res, next){
  console.log('calling /forgot with email :' + req.body.email);
  async.waterfall([
    function(done){
      console.log('generating token');
      crypto.randomBytes(20,function(err,buf){
        var token = buf.toString('hex');
        done(err,token)
      })
    },
    function(token,done){
      User.findOne({'local.email':req.body.email},function(err,user){
        if(!user){
          console.log('user not found');
          //req.flash('info','No account with that email address exists');
          return res.send({message:"No account with that email address exists"});
        }
        user.local.resetPasswordToken = token;
        user.local.resetPasswordExpires = Date.now() + 3600000;
        console.log('user',user);
        user.save(function(err){
          console.log('calling save');
          done(err,token,user);
        })
      })
    },
    function(token,user,done){
      var smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'yahoo',
        auth: {
          user: 'RMLBPOC@yahoo.com',
          pass: 'AusNZ0215'
        }
      });
      //console.log(user);
      var mailOptions = {
        to: user.local.email,
        from: 'Fun Project Team <RMLBPOC@yahoo.com>',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://' + req.headers.host + '/#/reset/' + token + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        //req.flash('info', 'An e-mail has been sent to ' + user.local.email + ' with further instructions.');
        res.send({message:user.local.email,token:token});
        //done(err, 'done');
      });
    }
  ],function(err) {
    if (err) return next(err);
    res.redirect('/');
  })
};

var showReset =  function(req,res,next){
  console.log('calling reset with token ', req.params.token);
  User.findOne({'local.resetPasswordToken':req.params.token,'local.resetPasswordExpires':{$gt:Date.now()}},function(err,user){
    if(!user){
      console.log('user not found');
      //req.flash('info', 'Password reset token is invalid or has expired.');
      res.send({valid:false,message:'Password reset token is invalid or has expired.'})
    }else{
      res.send({valid:true});
    }
  })
};

var resetPassword = function(req,res,next){
  var password = req.body.password;
  var token = req.body.token;
  console.log(token);
  console.log(password);
  async.waterfall([
    function(done){
      User.findOne({'local.resetPasswordToken':token,'local.resetPasswordExpires':{$gt:Date.now()}},function(err,user){
        if(!user){
          console.log('no user found');
          //req.flash('info', 'Password reset token is invalid or has expired.');
          res.send({valid:false,message:'Password reset token is invalid or has expired.'})
        }
        //console.log('user before updated password : ', user);
        user.local.password = user.generateHash(password);
        user.local.resetPasswordExpires =null;
        user.local.resetPasswordToken = null;
        //console.log('user after updated password : ', user);
        user.save(function(err) {
          console.log('user saved');

          //req.logIn(user, function(err) {
          done(err, user);
          //});
        });
      })
    },
    function(user,done){
      var smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'yahoo',
        auth: {
          user: 'RMLBPOC@yahoo.com',
          pass: 'AusNZ0215'
        }
      });
      var mailOptions = {
        to: user.local.email,
        from: 'Fun Project Team <RMLBPOC@yahoo.com>',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
        'This is a confirmation that the password for your account ' + user.local.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        //req.flash('info', 'Success! Your password has been changed.');
        console.log('sending email - ',user);
        res.send({updated:true,user:user});
      });
    }
  ], function(err){
    res.redirect('/')
  })
};

var signup = function(req,res,next){
  console.log('calling passport authenticate');
  passport.authenticate('local-signup',function(err,user,info){
    //console.log("err : " + err);
    //console.log("user : " + user);
    //console.log("info : " + info);
    //console.log('inside custom callback');
    if (err) {
      console.log("Error: " + err);
      return next(err);
    }
    if (!user) {
      console.log(info);
      return res.send(info.message);
    }
    req.logIn(user, function(err) {
      //console.log(user);
      if (err) { return next(err); }
      res.send({redirect:'/',user:user});
    });
  })(req, res, next);
};

var deleteUserById = function(req,res){
  console.log('delete by id');
  User.findByIdAndRemove(new Object(req.params.id), function(err, user) {
    if (err) {
      res.status(500);
      res.json({
        type: false,
        data: "Error occured: " + err
      })
    } else {
      res.json({
        type: true,
        data: "User: " + req.params.id + " deleted successfully"
      })
    }
  })
};

var deleteUserByEmail = function(req,res){
  console.log('delete by email');
  User.findOne({'local.email':req.params.email}, function(err, user) {
    if (err) {
      res.status(500);
      res.json({
        type: false,
        data: "Error occured: " + err
      })
    } else {
      if (!user) {
        console.log('user not found');
        res.send({message:'user not found'});
      }else{
        user.remove(function(){
          res.json({
            type: true,
            data: "User: " + req.params.email + " deleted successfully"
          })
        })
      }


    }
  })
};


exports.getHomePage = getHomePage;
exports.login = login;
exports.logout = logout;
exports.forgot = forgot;
exports.showReset = showReset;
exports.resetPassword = resetPassword;
exports.signup = signup;
exports.deleteUserById = deleteUserById;
exports.deleteUserByEmail = deleteUserByEmail;