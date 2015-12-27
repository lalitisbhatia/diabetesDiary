var diaryService = require('../services/diary');
var saveEntry = function(req,res,next){
  var entry = req.body;
  diaryService.saveEntry(entry).then(function(data){
    res.send(data);
  })
};

exports.saveEntry = saveEntry;