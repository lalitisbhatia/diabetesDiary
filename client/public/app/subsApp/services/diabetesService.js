subsApp.factory('diabetesService',function($http,$log,$rootScope) {
  var diabetesService = {
    searchFoods: function(name){
      return $http({
          method : 'GET',
          url : '/searchFoods/' + name
        }
      )
        .then(function(resp){
          return resp.data.results;
        })
    },
    targetRate: 150,
    correctiveFactor: 80,
    carbFactor:30,
    getFavorites : function(){

    },
    addFavorite : function(){

    },
    removeFavorite : function(){

    },
    diaryEntry : {

    },
    addEntry : function(entry){
      return $http({
        method : 'POST',
        url : '/entry',
        data : entry
      }).then(function(response){
        console.log("response - ",response);
        return response.data;
      })
    }

  };

  return diabetesService;
});