var Controllers = angular.module('Controllers',[]);

Controllers.controller('searchCtrl', function($scope, searchService) {
  $scope.search = searchService.search
})

Controllers.controller('DetailCtrl', function($scope, id) {
  	$scope.id = id
	var restraunts = [
	{
		"name":"Apolo",
		"id":"0",
		"type":"Chinese",
		"price":"$",
		"description":"This is a famous restraunt for Chinese students."
	},
	{
		"name":"Oishi Bowl",
		"id":"1",
		"type":"Japanese",
		"price":"$",
		"description":"This is a famous restraunt for Japanese students."
	},	
	{
		"name":"Plum Tree",
		"id":"2",
		"type":"Japanese",
		"price":"$$",
		"description":"This is an expensive restraunt for date."
	},
	{
		"name":"College Town Bagels",
		"id":"3",
		"type":"American",
		"price":"$",
		"description":"This is the best place to have breakfast."
	}
	]

	$scope.restraunt = restraunts[id];
})


Controllers.controller('MainCtrl', function($scope, $ionicSideMenuDelegate){
  $scope.toggleSideMenu = function(){
    $ionicSideMenuDelegate.toggleLeft();
  };
});

Controllers.controller('SearchCtrl', function($scope, $http){
  // $http.get('js/data.json').success(function(data){
  //   $scope.restruants = data;
  // });
	$scope.restraunts = [
	{
		"name":"Apolo",
		"id":"0",
		"type":"Chinese",
		"price":"$",
		"description":"This is a famous restraunt for Chinese students."
	},
	{
		"name":"Oishi Bowl",
		"id":"1",
		"type":"Japanese",
		"price":"$",
		"description":"This is a famous restraunt for Japanese students."
	},	
	{
		"name":"Plum Tree",
		"id":"2",
		"type":"Japanese",
		"price":"$$",
		"description":"This is an expensive restraunt for date."
	},
	{
		"name":"College Town Bagels",
		"id":"3",
		"type":"American",
		"price":"$",
		"description":"This is the best place to have breakfast."
	}
	]
});
