var FoodEntry  = require("../../app/models/foodEntry.js");

module.exports = function(app,passport){
  app.post('/foodEntry',isLoggedIn,create);
  app.put('/foodEntry/:foodEntryId',isLoggedIn,update);
  app.get('/foodEntry/:id',isLoggedIn,getById);
  app.delete('/foodEntry/:foodEntryId',isLoggedIn,del);


  //*************************************************//
  //********* ROUTE HANDLERS *********************//
  //*************************************************//

  function create(req,res){

    var userId = req.session.passport.user;
    var foodEntry = req.body;
    foodEntry.entryUserId = userId;

    FoodEntry(foodEntry).save(function(err,entry){
      if(err){
        console.log('*****  ',err);
        throw err;
      }
      res.send({"foodEntry":entry})
    });

    //res.send({msg:'ok'});
  }

  function update(req,res){

    var userId = req.session.passport.user;
    var foodEntry = req.body;
    foodEntry.entryUserId = userId;

    if(req.params.foodEntryId) {
      console.log('******** Food entry exists ********');
      FoodEntry.findOne(req.params.foodEntryId, function (err, fe) {
        if (err) {
          res.status(500);
          res.send({error: err});
        }
        //console.log('******* f before : ',fe);
        fe = foodEntry;
        //console.log('******* f after ', fe);

        FoodEntry(fe).update({upsert: true}, function (err, fdEn) {
          if (err) {
            res.status(500);
            res.send({error: err});
          }
          res.send({foodEntry: fe});
        })
      });
    }else {
      throw new Error({"msg":"PUT endpoint needs a food entry is param"})
    }

    //res.send({msg:'ok'});
  }

  function getById(req,res){
    FoodEntry.findOne({"_id":req.params.id})
      .populate("_foodId")
      .exec(function(err,entry){
        if(err){
          console.log("******  ",err);
          throw err;
        }
        res.send({foodEntry:entry})
      })
  }

  function del(req,res){
    FoodEntry.findByIdAndRemove(new Object(req.params.foodEntryId), function(err, user) {
      if (err) {
        res.status(500);
        res.json({
          type: false,
          data: "Error occured: " + err
        })
      } else {
        res.json({
          type: true,
          data: "foodEntryId: " + req.params.foodEntryId + " deleted successfully"
        })
      }
    })
  }
};



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
