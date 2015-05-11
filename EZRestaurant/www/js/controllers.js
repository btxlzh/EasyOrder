angular.module('starter.controllers',  ['ionic', 'ngCordova'])

.controller('CartCtrl', function($scope, DataService,LocalStorage) {
  $scope.dishes = DataService.dishes;
  $scope.checkout=function(){
    DataService.checkout();
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
.controller("RestaurantCtrl",function($scope,$http, restaurant_data,ErrorService) {
  $scope.restaurant = restaurant_data;
  console.log(restaurant_data);

})
.controller("RestaurantMenuCtrl",function($scope,$http, menu_data,ErrorService) {
  $scope.menu = menu_data;

})
.controller("RestaurantDishCtrl",function($scope,$http, dish_data,ErrorService,DataService) {
  $scope.dish = dish_data;
  $scope.addToCart=function(dish,num){
    DataService.addToCart(dish,num);
  }

})
.controller("SearchCtrl", function($scope, $cordovaBarcodeScanner,$http,$state,DataService,ErrorService) {

     // For JSON responses, resp.data contains the result

    // $scope.scanBarcode = function() {
    //     $cordovaBarcodeScanner.scan().then(function(imageData) {
    //         //var restaurantID= DataService.getRestaurantByQRCode(imageData.text);
    //        // state.go('tab.restaurant-detail',{'id':restaurantID});
    //          alert(imageData.text);
    //     }, function(error) {
    //          alert("error");
    //     });
    // };
    $scope.baseUrl = 'http://localhost:1337';
   
    
    $scope.listen = function(){
      io.socket.get('/Order/listenOrder',function serverResponded (body, JWR) {

          // JWR ==> "JSON WebSocket Response"
          console.log('Sails responded with: ', body);
          console.log('with headers: ', JWR.headers);
          console.log('and with status code: ', JWR.statusCode);

        

          // first argument `body` === `JWR.body`
          // (just for convenience, and to maintain familiar usage, a la `JQuery.get()`)
        });
      }
    io.socket.on('order', function onServerSentEvent (msg) {
              console.log(msg);
              $scope.$digest();
          });
    
 
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