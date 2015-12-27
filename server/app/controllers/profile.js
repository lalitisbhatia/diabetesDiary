var async = require('async');
var crypto = require('crypto');
var q = require('q');
// async library to avoid dealing with nested callbacks by using with the help of async.waterfall method
var nodemailer = require('nodemailer');
var User = require('../../app/models/user.js');

var getProfile = function(req,res){
  console.log('rendering profile');
  var userId = req.session.passport.user;
  User.findOne({"_id":userId},function(err,usr) {
    if (!usr) {
      console.log('no user found');
      res.send({message: 'No user found'});
    }
    res.send({user: usr});
  })
};

var saveProfile = function(req,res){
  var deferred = q.defer();
  var profileObj = req.body;
  console.log(profileObj);
  var userId = req.session.passport.user;
  User.findOneAndUpdate({"_id":userId},{insulinProfile:profileObj},function(err,result){
    if(err){
      console.log('no user found');
      res.send(err);
    }
    res.send({user: result});
  })
};

exports.getProfile = getProfile;
exports.saveProfile = saveProfile;
