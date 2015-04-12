var Controllers = angular.module('Controllers',[]);

Controllers.controller('searchCtrl', function($scope, searchService) {
  $scope.search = searchService.search
})

Controllers.controller('DetailCtrl', function($scope,$http, id) {
  	$scope.id = id;
  	$http.get('http://localhost:1337/restaurant/'+id).then(function(resp) {
   	$scope.restaurant = resp.data;
   	console.log(resp.data);
    // For JSON responses, resp.data contains the result
  }, function(err) {
	$scope.msg=err;
    // err.status will contain the status code
  })
	
})


Controllers.controller('MainCtrl', function($scope, $ionicSideMenuDelegate){
  $scope.toggleSideMenu = function(){
    $ionicSideMenuDelegate.toggleLeft();
  };
});

Controllers.controller('SearchCtrl', function($scope, $http){
  $http.get('http://localhost:1337/restaurant/getAll').then(function(resp) {
   	$scope.restaurants = resp.data;
    // For JSON responses, resp.data contains the result
  }, function(err) {
	$scope.msg=err;
    // err.status will contain the status code
  })
 
	
});
