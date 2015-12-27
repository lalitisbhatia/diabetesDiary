subsApp.controller('diabetesController',['$scope','$log','diabetesService','profileService',function($scope,$log,diabetesService,profileService){

  $scope.insulinCarb = 0;
  $scope.insulinGlucose = 0;
  $scope.insulinCorrected = 0;
  $scope.glucose = 0;
  $scope.carbs = 0;

  $scope.diaryEntry = diabetesService.diaryEntry;
  if($scope.diaryEntry){
    console.log("diaryEntry exists ", $scope.diaryEntry);
    $scope.glucose =   $scope.diaryEntry.glucose||0;
    $scope.carbs =   $scope.diaryEntry.carbs||0;
    $scope.insulinCorrected =   $scope.diaryEntry.insulin||0;
  }

  $scope.calculateUnits = function(){
    //console.log('**** changed ******');
    $scope.insulinCarb = Math.round(($scope.carbs/$scope.insulinProfile.carbFactor)*100)/100;
    //console.log("carbs",$scope.carbs);
    //console.log("insulinCarb",$scope.glucose);
    $scope.insulinGlucose = Math.round((($scope.glucose - $scope.insulinProfile.targetRate)/$scope.insulinProfile.correctiveFactor)*100)/100;
    //console.log("glucose",$scope.glucose);
    //console.log("insulinGlucose",$scope.insulinGlucose);
    var insCorrected = Math.round(($scope.insulinGlucose + $scope.insulinCarb)*100)/100;
    $scope.insulinCorrected = insCorrected<0?0:insCorrected;
    $scope.diaryEntry = {
      glucose: parseInt($scope.glucose),
      carbs: parseInt($scope.carbs),
      insulin: parseFloat($scope.insulinCorrected)
    };
    //console.log($scope.diaryEntry);
  };

  $scope.saveInsulinProfile = function(){
    var insulinProfile = {
      targetRate: parseInt($scope.insulinProfile.targetRate),
      correctiveFactor: parseInt($scope.insulinProfile.correctiveFactor),
      carbFactor: parseInt($scope.insulinProfile.carbFactor)
    };
    console.log('update insulin profile', insulinProfile);
    profileService.updateProfile(insulinProfile).then(function(data){
      console.log('***** saved profile data *****',data);
      $scope.user = data.user;
      $scope.insulinProfile = $scope.user.insulinProfile;
    })
  };

  $scope.search = function(name){

  };
  $scope.saveToDiary = function(){
    diabetesService.diaryEntry = {
      glucose: parseInt($scope.glucose),
      carbs: parseInt($scope.carbs),
      insulin: parseFloat($scope.insulinCorrected)
    };
    console.log($scope.diaryEntry);
  };

  $scope.init = function () {
    console.log('diabetes controller initialised');
    $scope.user = {};
    $scope.insulinProfile = {};
    $scope.getProfile();
  };

  $scope.getProfile = function(){
    profileService.getProfile().then(function(data){
      $scope.user = data.user;
      $scope.insulinProfile = $scope.user.insulinProfile;
      console.log('******  $scope.insulinProfile  ***',$scope.insulinProfile);
    })
  };
}]);