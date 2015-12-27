'use strict';
var mongoose = require('mongoose');
var q = require('q');
var config = require('../../config/config');

var DiaryEntrySchema = mongoose.Schema({
  userId    : String,
  entryDate : Date,
  entryTime  :Date,
  injectionSite : {
    type: String,
    enum: config.injectionSites
  },
  insulinType : {
    type: String,
    enum: config.insulinTypes
  }
});

DiaryEntrySchema.index({userId: 1});
DiaryEntrySchema.statics.saveEntry = function(diaryEntry){
  var deferred = q.defer();
  var Entry = new DiaryEntry(diaryEntry);
  Entry.save(function(err,result){
    if(err){
      logger.error("***********   ERROR saving diary entry - ",err);
      return deferred.reject(err);
    }
    deferred.resolve(result);
  });
  return deferred.promise;
};
var DiaryEntry = module.exports = mongoose.model('DiaryEntry', DiaryEntrySchema);