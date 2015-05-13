angular.module('starter.controllers',  ['ionic', 'ngCordova'])



.controller('OrderDetailCtrl', function($scope, $stateParams) {
})

.controller('LoginCtrl', function($q,$scope,$http,$state,$ionicPopup,$ionicHistory,AccountService,ErrorService,LocalStorage) {
  
  $scope.postData={};
  $scope.login = function(){
      AccountService.login($scope.postData).then(function(data){
        
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
        AccountService.restaurant=data;
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


}
})

.controller("RestaurantMenuCtrl",function($scope,$http,menu_data,ErrorService,AccountService) {
  $scope.menu = menu_data;
  $scope.listCanSwipe=true;
  $scope.add=function(){
    AccountService.createDish(AccountService.menu.id).then(function callback(data){
      console.log(data);
      $scope.menu.dishes.push(data);
    })
  }
  $scope.delete=function(index){
    
    AccountService.deleteDish($scope.menu.dishes[index].id).then(function callback(data){
      $scope.menu.dishes.splice(index, 1);
    })
  }

})
.controller("RestaurantDishCtrl",function($scope,$http, dish_data,ErrorService,DataService) {
  $scope.dish = dish_data;
  $scope.addToCart=function(dish,num){
    DataService.addToCart(dish,num);
  }

})
.controller("OrderCtrl", function($scope, $cordovaBarcodeScanner,$http,$state,ErrorService) {
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
    
 
});