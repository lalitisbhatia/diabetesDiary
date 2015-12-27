'use strict';
// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
  firstName    : String,
  lastName     : String,
  email        : String,
  password     : String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  insulinProfile : {
    targetRate: Number,
    correctiveFactor: Number,
    carbFactor: Number
  }
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    //console.log('calling validate with '+ password);
    //console.log(bcrypt.hashSync(password, bcrypt.genSaltSync(8), null));
    //console.log(this.local.password);
    //console.log(bcrypt.compareSync(password, this.local.password));
    return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
