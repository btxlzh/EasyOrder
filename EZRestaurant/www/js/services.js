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
      dataFactory.getRestaurant = function(){
        console.log(AccountService);
        return $http.get('http://localhost:1337/restaurant/'+AccountService.restaurant.id)
            .then(
                  function(resp){
                    console.log(resp.data);
                    dataFactory.restaurant = resp.data;
                    return resp.data;
                  },function (err){
                    console.log(err);
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
                // console.log("add exist");
                //  console.log(Cart.dishes);

        }else {

          dish.num=num;
          //push new
          dataFactory.dish_map[dish.id]=dataFactory.dishes.length;
          dataFactory.dishes.push(dish);
           // console.log("new add");
           // console.log(Cart.dishes);
           // console.log(Cart.dish_map);
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
      AccountFactory.user =null;
      AccountFactory.restaurant =null;
      
      AccountFactory.login = function(credential){
          $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
          }); 
          return $http.post("http://localhost:1337/auth/login/",credential)
          .then( 
              function(respUser){
                  AccountFactory.setUser(respUser.data);
                  AccountFactory.getToken();
                  AccountFactory.getRestaurant(respUser.data.restaurant,respUser.data.id);
                  console.log(respUser.data.restaurant+"  "+respUser.data.id);
          })
      }
      AccountFactory.logout = function(){
          $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
          });
          LocalStorage.del('EZ_LOCAL_TOKEN');
          delete AccountFactory.user;
          delete AccountFactory.restaurant;
          return $http.get("http://localhost:1337/auth/logout");
      }
      AccountFactory.getToken =function (){
        return $http.get("http://localhost:1337/user/jwt").then(function(resp){
            LocalStorage.setObj('EZ_LOCAL_TOKEN',resp.data.token);
            return resp.data.token;
        });
        }
      AccountFactory.getUser =function (){
         console.log('gerUser Start!');
         var d = $q.defer();
        if(AccountFactory.user){
          console.log(AccountFactory.user);
          console.log("res");
          console.log(AccountFactory.restaurant);
          if(AccountFactory.restaurant){
            d.resolve(AccountFactory.restaurant);
          }
          else{
             var promise = AccountFactory.getRestaurant(AccountFactory.user.restaurant,AccountFactory.user.id);
             $q.all([promise]).then(function(){
                d.resolve(AccountFactory.restaurant);
             })
          }
        }else {
          console.log('user not exist');
          var ret;
          if(!LocalStorage.exist('EZ_LOCAL_TOKEN')){
            console.log('No local token');
            d.reject('No local token');
          }else{
              var obj = LocalStorage.getObj('EZ_LOCAL_TOKEN');
              if(obj){
                $http.get("http://localhost:1337/auth/loginWithToken?access_token="+obj)
                .then(
                      function(resp){
                          console.log('GET User by login with token'+obj);
                            AccountFactory.user = resp.data;
                              AccountFactory.getRestaurant(resp.data.restaurant,resp.data.id).then(function(data){
                                  d.resolve(AccountFactory.restaurant);
                              });
                              
              
                      },function (err){
                          console.log('error token');
                         LocalStorage.del('EZ_LOCAL_TOKEN');
                           d.reject('Error local token');
                      }
                  );
                
              } 
            
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
      AccountFactory.createDish=function(menu_id){
          return $http.get("http://localhost:1337/dish/createDish?owner="+menu_id)
            .then(
                  function(resp){
                      return resp.data;
                  }
            );
          
      }
     AccountFactory.deleteDish=function(dish_id){
          return $http.get("http://localhost:1337/dish/destroy/"+dish_id)
            .then(
                  function(resp){
                      return resp.data;
                  }
            );
          
      }      
    AccountFactory.getMenu=function(id){
        return $http.get('http://localhost:1337/menu/'+id+'/all')
            .then(
                  function(resp){
                    console.log(resp.data);
                    AccountFactory.menu = resp.data;
                    return resp.data;
                  },function (err){
                    console.log(err);
                    return err;
                  }
            );
      }
      AccountFactory.getRestaurant = function(rid,uid){
        if (rid!=null){
          return $http.get('http://localhost:1337/restaurant/'+rid)
              .then(
                    function(resp){
                      console.log("getRestaurant");
                      console.log(resp.data);
                      AccountFactory.restaurant = resp.data;
                      console.log(AccountFactory.restaurant);
                      return resp.data;
                    },function (err){
                      console.log(err);
                      return err;
                    }
              );
        }
        else {
            return $http.get("http://localhost:1337/restaurant/createRestaurant?owner="+uid)
            .then(
                  function(resp){
                      console.log("create restaurant");
                      console.log(resp.data.restaurant);
                      AccountFactory.restaurant = resp.data.restaurant;
                      AccountFactory.user =  resp.data.user;
                      return resp.data.restaurant;
                  }
            );

      }
    }
     AccountFactory.getDish = function(id){
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

