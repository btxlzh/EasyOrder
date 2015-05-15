angular.module('starter.services', [])

.factory('DataService',function($http,AccountService){
      function getUrlVars(Url) {
          var vars = {};
          var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
          function(m,key,value) {
            vars[key] = value;
          });
          return vars;
      }

      var dataFactory = {};
      dataFactory.cart=[];
      dataFactory.getAllRestaurants = function(){
          return $http.get('http://localhost:1337/restaurant/');
      } 
      dataFactory.getRestaurant = function(id){
        return $http.get('http://localhost:1337/restaurant/'+id)
            .then(
                  function(resp){
                    dataFactory.restaurant = resp.data;
                    return resp.data;
                  },function (err){
                    return err;
                  }
            );
      }
      dataFactory.getFavoriateRestaurant = function(){
        console.log("getFavoriateRestaurant is called ");
        return $http.get('http://localhost:1337/User/getFavorite?user='+ AccountService.user.id)
            .then(
                  function(resp){
                    console.log(resp.data);
                    dataFactory.favoriteRestaurants = resp.data[0].favoriteRestaurant;
                    //console.log("dataFactory.favoriteRestaurant: "+dataFactory.favoriteRestaurant);
                    return resp.data;
                  },function (err){
                    return err;
                  }
            );
      }
      dataFactory.getMenu = function(id){
        return $http.get('http://localhost:1337/menu/'+id+'/all')
            .then(
                  function(resp){
                    console.log(resp.data);
                    dataFactory.menu = resp.data;
                    return resp.data;
                  },function (err){
                    console.log(err);
                    console.log(dataFactory.restaurant.menu);
                    return err;
                  }
            );
      }
       dataFactory.getDish = function(id){
        return $http.get('http://localhost:1337/dish/'+id)
            .then(
                  function(resp){
                    console.log(resp.data);
                    return resp.data;
                  },function (err){
                    console.log(err);
                    return err;
                  }
            );
      }
      dataFactory.getRestaurantByQRCode = function(Image_data){
          return getUrlVars(Image_data.te)["id"];
      }
      dataFactory.dishes=[];
      dataFactory.dish_map={};
      dataFactory.addToCart=function(dish,num){

        if(dish.id in dataFactory.dish_map){
              index =dataFactory.dish_map[dish.id];
          dataFactory.dishes[index].num+=num;

        }else {

          dish.num=num;
          //push new
          dataFactory.dish_map[dish.id]=dataFactory.dishes.length;
          dataFactory.dishes.push(dish);
        }
        return ;
      }
      dataFactory.getCart=function(){
        return dataFactory.dishes;
      }

      dataFactory.clearCart =function(){
        dataFactory.dishes.length=0;
        return ;
      }
      dataFactory.checkout = function(){
        var requestData={};
        requestData.user = AccountService.user.id;
        requestData.orderDetail = dataFactory.dishes;
        requestData.restaurant = dataFactory.restaurant.id;
        return $http.post('http://localhost:1337/Order/create',requestData, {
            headers: { 'Content-Type': 'application/json'}
        }).then(
                      function(resp){
                        console.log(resp.data);
                        return resp.data;
                      },function (err){
                        console.log(err);
                        return err;
                      }
                );
      }
      return dataFactory;
  })
.factory('AccountService',function($http,$ionicHistory,$q,LocalStorage){
      var AccountFactory= {};
      AccountFactory.login = function(credential){
          $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
          }); 
          return $http.post("http://localhost:1337/auth/login/",credential)
          .then( 
              function(respUser){
                  return $http.get("http://localhost:1337/user/jwt")
                  .then( 
                        function(respToken){
                          AccountFactory.setUser(respUser.data); 
                          return {
                              user:respUser.data,
                              token:respToken.data
                          }
                        }
                  )
              }
          );

      }
      AccountFactory.loginWithToken = function(token){
          return 
      }
      AccountFactory.logout = function(){
          $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
          });
          LocalStorage.del('EZ_LOCAL_TOKEN');
          delete AccountFactory.user;
          return $http.get("http://localhost:1337/auth/logout");
      }
      AccountFactory.getToken =function (){
        return $http.get("http://localhost:1337/user/jwt")
        }
      AccountFactory.getUser =function (){
         console.log('gerUser Start!');
         var d = $q.defer();
        if(AccountFactory.user){
          console.log('exist user'+AccountFactory.user);
          d.resolve(AccountFactory.user);
        }else {
          console.log('user not exist');
          var ret;
          if(!LocalStorage.exist('EZ_LOCAL_TOKEN')){
            console.log('No local token');
            d.reject('No local token');
          }else{
            $http.get("http://localhost:1337/auth/loginWithToken?access_token="+LocalStorage.getObj('EZ_LOCAL_TOKEN').token)
            .then(
                  function(resp){
                       console.log('GET User by login with token'+LocalStorage.getObj('EZ_LOCAL_TOKEN').token);
                      AccountFactory.setUser(resp.data); 
                        d.resolve(resp.data);
                  },function (err){
                      console.log('error token');
                      LocalStorage.del('EZ_LOCAL_TOKEN');
                       d.reject('Error local token');
                  }
            );
          }
        }
        return d.promise;
      }
      AccountFactory.setUser = function (user){
          AccountFactory.user = user;
      }
      AccountFactory.editUser = function(att,val){
          return $http.get("http://localhost:1337/user/update/"+ AccountFactory.user.id+"?"+att+'='+val)
          .then(
                function(resp){
                    return resp.data;
                }
          );
      }
      AccountFactory.checkLogin =function($scope,$state,$ionicHistory){
        return AccountFactory.getUser().then(function(data){
            $scope.user=data;
            var x= true;
            return x;
          },function(err){
              $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
          $state.go('tab.login');
           var x= false;
          return x;
      })
      }
      AccountFactory.addToFavorite = function(restaurant_id){
        var requestData={};
        requestData.user = AccountFactory.user.id;
        requestData.restaurant = restaurant_id;
        return $http.post('http://localhost:1337/user/addToFavorite',requestData, {
            headers: { 'Content-Type': 'application/json'}
        }).then(
                      function(resp){
                        console.log("addToFavorite: "+resp.data[0]);
                        return resp.data;
                      },function (err){
                        console.log(err);
                        return err;
                      }
                );
      }
      AccountFactory.deleteFromFavorite = function(restaurant_id){
        var requestData={};
        requestData.user = AccountFactory.user.id;
        requestData.restaurant = restaurant_id;
        return $http.post('http://localhost:1337/user/deleteFromFavorite',requestData, {
            headers: { 'Content-Type': 'application/json'}
        }).then(
                      function(resp){
                        console.log("delete favorite: "+resp.data[0]);
                        return resp.data;
                      },function (err){
                        console.log(err);
                        return err;
                      }
                );
      }

      return AccountFactory;
  })
.factory('ErrorService',function($ionicPopup){
  var Error = {};
  Error.popUp = function(err){
    $ionicPopup.alert({
           title: "error",
           template: err
        });
  }
  return Error;

});

