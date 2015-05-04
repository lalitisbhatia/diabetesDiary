var mongoose = require('mongoose');

var Food = require('../../app/models/food.js');
var Exercise = require('../../app/models/exercise.js');
var FeelingEntry = require('../../app/models/feelingEntry.js');
var Category = require('../../app/models/category.js');
var FoodEntry = require('../../app/models/foodEntry.js');
var Meal = require('../../app/models/meal.js');
var User = require('../../app/models/user.js');

var configDB = require('../../../server/config/config.js');

console.log(configDB.db);
console.log("****************************");
console.log("***** STARTING TEARDOWN ****");
console.log("****************************");

console.log(mongoose.connection.readyState);

describe('clean out test db',function(){
  before(function(done) {
    //Another possibility is to check if mongoose.connection.readyState equals 1
    if (mongoose.connection.db) return done();
    mongoose.connect(configDB.db, done);
  });

  it('should delete users',function(done){
    User.remove({}, function(err) {
      if (err) {
        throw err;
        }
      });
    done();
  });

  it('should delete foods',function(done){
    Food.remove({}, function(err) {
      if (err) {
        throw err;
      }
    });
    done();
  });
  it('should delete feeling entries',function(done){
    FeelingEntry.remove({}, function(err) {
      if (err) {
        throw err;
      }
    });
    done();
  });
  it('should delete feeling entries',function(done){
    FoodEntry.remove({}, function(err) {
      if (err) {
        throw err;
      }
    });
    done();
  });
});

after(function(done){
  mongoose.connection.db.dropDatabase(function(){
    mongoose.connection.close(function(){
      done();
    });
  });
});