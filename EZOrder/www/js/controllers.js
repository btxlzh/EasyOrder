angular.module('starter.controllers', [])

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope,$http,$state) {
  $scope.login = function(){
    console.log($scope.postData);
    //$http.get("http://localhost:1337/auth/login?email="+$scope.postData.email+"&password="+$scope.postData.password)
    $http.post("http://localhost:1337/auth/login/",$scope.postData)
    .then(function(resp) {
        $scope.msg= "succ"
        // For JSON responses, resp.data contains the result
        $state.go('tab.account-detail');
      }, function(err) {
        $scope.msg="error:"+err;
        // err.status will contain the status code
      })

    }
})
.controller('AccountDetailCtrl', function($scope,$http,$state) {
  $http.get("http://localhost:1337/user/jwt")
    .then(function(resp) {
        $scope.data= resp.data
        // For JSON responses, resp.data contains the result
      }, function(err) {
        $scope.data="error:"+err;
        // err.status will contain the status code
      })
  $scope.logout = function(){
    //$http.get("http://localhost:1337/auth/login?email="+$scope.postData.email+"&password="+$scope.postData.password)
    $http.get("http://localhost:1337/auth/logout")
    .then(function(resp) {
        $scope.msg= "succ"
        // For JSON responses, resp.data contains the result
        $state.go('tab.account');
      }, function(err) {
        $scope.msg="error:"+err;
        // err.status will contain the status code
      })
    }
})

.controller("SearchCtrl", function($scope, $cordovaBarcodeScanner) {
 
    $scope.scanBarcode = function() {
        $cordovaBarcodeScanner.scan().then(function(imageData) {
            alert(imageData.text);
            console.log("Barcode Format -> " + imageData.format);
            console.log("Cancelled -> " + imageData.cancelled);
        }, function(error) {
            console.log("An error happened -> " + error);
        });
    };
 
});