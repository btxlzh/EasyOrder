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
      AccountService.login($scope.postData).then(function(data){
      console.log(data);
        $state.go('tab.restaurant');
      },function(err){
          ErrorService.popUp("WRONG email OR password!");
      })
    return ;
  }
})
.controller('RestaurantCtrl', function($scope,$http,$state,$ionicHistory,AccountService,LocalStorage) {
  
  $scope.$on('$ionicView.beforeEnter', function(){
    AccountService.getUser().then(function(data){
        $scope.restaurant = data;
    },function(err){
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
          });
        $state.go('login');
    })
  });
  $scope.logout = function(){
    AccountService.logout()
    .success(function(resp) {
        $state.go('login');
        // For JSON responses, resp.data contains the result
   });

  $scope.update=function(){
    AccountService.updateRestaurant($scope.postData).then(function(data){

        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
        $state.go('tab.restaurant');
    },function(err){
       
  })
  }
}
})

.controller("RestaurantMenuCtrl",function($scope,$http,menu_data,ErrorService) {
  $scope.menu = menu_data;

})
.controller("RestaurantDishCtrl",function($scope,$http, dish_data,ErrorService,DataService) {
  $scope.dish = dish_data;
  $scope.addToCart=function(dish,num){
    DataService.addToCart(dish,num);
  }

})
.controller("RestaurantEditCtrl",function($scope,$http, dish_data,ErrorService,AccountService) {
  
  $scope.edit=function(){
    AccountService.editRestaurant($scope.postData);
  }

})
.controller("OrderCtrl", function($scope, $cordovaBarcodeScanner,$http,$state,DataService,ErrorService) {

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
   
    $scope.orders=[];
    $scope.listen = function(){
      io.socket.get('/Order/listenOrder',function serverResponded (body, JWR) {

          // JWR ==> "JSON WebSocket Response"
          console.log('Sails responded with: ', body);
          console.log('with headers: ', JWR.headers);
          console.log('and with status code: ', JWR.statusCode);
        });
      }
    io.socket.on('order', function onServerSentEvent (obj) {
             if(obj.verb === 'created'){
              $scope.orders.push(obj.data);
              // Add the data to current chatList
              // Call $scope.$digest to make the changes in UI
              $scope.$digest();
            }
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