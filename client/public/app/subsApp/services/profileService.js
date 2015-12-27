'use strict';

subsApp.factory('profileService',function($http,$log,$rootScope){
    var profileService = {
        getProfile : function () {
            return $http({
                method : 'GET',
                url : '/profile'
            })
                .success(function(data,status,headers,config){
                    //console.log(data);
                })
                .error(function(){
                    //
                })
                .then(function(response){
                    return response.data;
                })
        },
        updateProfile : function(profile){
          console.log('calling update',profile);
             return $http({
                method : 'POST',
                url : '/profile',
                data : profile
             }).then(function(response){
               console.log("response - ",response);
               return response.data;
             })

        }
    };

    return profileService
});