subsApp.controller('homeController',['$scope','$log','profileService','utilityService','feelingService',function($scope,$log,profileService,utilityService,feelingService) {

  $scope.init = function () {
    console.log('home controller initialised');
    $scope.user = {};
    $scope.profile = {};
    $scope.getProfile();
    $scope.showValErrors = false;
    $scope.showTabs = true;
    $scope.greeting = utilityService.getGreeting();

    $scope.images = utilityService.images;
    console.log($scope.images);
    $scope.bgImage = '';
    $scope.bgImage = $scope.getRandomImage($scope.images,$scope.greeting);
  };

  $scope.$on('gotUser',function(event,data){
    console.log('*****  $scope.profile *******',$scope.user);
  });


  $scope.getProfile = function(){
    profileService.getProfile().then(function(data){
      $scope.user = data.user;
      $scope.profile = $scope.user.profile;

      $scope.$broadcast('gotUser',{
        user:$scope.user
      });

      if($scope.profile){

        //update date of birth field
        if($scope.profile.dateOfBirth){
          var dt = new Date($scope.profile.dateOfBirth);
          console.log(dt);
          $scope.profile.dateOfBirth = dt;
          $scope.placeholderVal = $scope.profile.dateOfBirth;
          console.log($scope.user);
        }
      }
    })
  };


  $scope.getRandomImage = function(images,greeting){
    var rand = Math.floor(Math.random()*(6));
    console.log(greeting);
    console.log(rand);
    switch(greeting){
      case 'morning' :
        return images.morning[rand];
      case 'evening' :
        return images.evening[rand];
      case 'afternoon' :
        return images.afternoon[rand];
    }
  }

}]);
