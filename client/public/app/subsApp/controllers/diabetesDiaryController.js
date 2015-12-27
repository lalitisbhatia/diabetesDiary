subsApp.controller('diabetesDiaryController',['$scope','$log','$filter','diabetesService','profileService',function($scope,$log,$filter,diabetesService,profileService) {
  console.log(diabetesService.diaryEntry);
  $scope.diaryEntry = diabetesService.diaryEntry;
  var dt = new Date();
  $scope.diaryEntry.entryDate = $filter('date')(new Date(),'EEE, MMM dd h:m a');

  $scope.entry = {
    userId:'567ef22f537e5b4ee2db5a7c',
    entryDate: new Date()
  };
  $scope.saveEntry = function(){
    diabetesService.addEntry($scope.entry).then(function(data){
      console.log(data);
    })
  }
}]);