angular.module('starter.controllers',  ['ionic', 'ngCordova'])

.controller('ChatsCtrl', function($scope, Chats,LocalStorage) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('LoginCtrl', function($q,$scope,$http,$state,$ionicPopup,$ionicHistory,AccountService,ErrorService,LocalStorage) {
  
  $scope.postData={};
  $scope.login = function(){
    //$http.get("http://localhost:1337/auth/login?email="+$scope.postData.email+"&password="+$scope.postData.password)
    AccountService.login($scope.postData).then(function(data){
      console.log(data);
      var promise1 = AccountService.setUser(data.user);
      var promise2 = LocalStorage.setObj('EZ_LOCAL_TOKEN',data.token);
      $q.all([promise1,promise2]).then(function(){
          $state.go('tab.account');
      });
    },function(err){
        ErrorService.popUp("WRONG email OR password!");
    })
    return ;
  }
})
.controller('AccountCtrl', function($scope,$http,$state,$ionicHistory,AccountService,LocalStorage) {
  
  $scope.$on('$ionicView.beforeEnter', function(){
    AccountService.getUser().then(function(data){
        $scope.user=data;
        console.log(data);
    },function(err){
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
          });
        $state.go('tab.login');
    })
  });
  $scope.logout = function(){
    AccountService.logout()
    .success(function(resp) {
        $state.go('tab.login');
        // For JSON responses, resp.data contains the result
   });
  }
})
.controller("RestaurantDetailCtrl",function($scope,$http, $stateParams,DataService,ErrorService) {
    DataService.getRestaurant($stateParams.id)
    .success(function(data){
        $scope.restaurant = data;
        console.log(data);
    })
    .error(function(error){
        ErrorService.popUp("unable to get restaurant data from server");
    });
})
.controller("SearchCtrl", function($scope, $cordovaBarcodeScanner,$http,$state,DataService,ErrorService) {

     // For JSON responses, resp.data contains the result

    
   
    $scope.scanBarcode = function() {
        $cordovaBarcodeScanner.scan().then(function(imageData) {
            //var restaurantID= DataService.getRestaurantByQRCode(imageData.text);
           // state.go('tab.restaurant-detail',{'id':restaurantID});
             alert(imageData.text);
        }, function(error) {
             alert("error");
        });
    };
 
})
.controller("ProfileCtrl",function($scope,$http,$state,AccountService){
    $scope.user = AccountService.user;
    $scope.edit = function (att, val){
       console.log(att,val);
        AccountService.editUser(att,val).then(function(data){
            AccountService.user = data;
            $scope.user = data;
            console.log(data);
        },function(err){
          return "err";
        });
        return "succ";
    }
});