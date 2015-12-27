var diaryEntry = require('../models/diaryEntry');
var saveEntry = function(entry){
  return diaryEntry.saveEntry(entry).then(function(data){
    return data;
  })
};

exports.saveEntry = saveEntry;