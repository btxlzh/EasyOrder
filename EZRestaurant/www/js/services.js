angular.module('starter.services', [])
.factory('OrderService',function($http,$ionicHistory,$q,LocalStorage){
    var OrderFactory= {};
    return OrderFactory;
})
.factory('FileService',function($http,$ionicHistory,$q,LocalStorage){
    var FileFactory= {};
    FileFactory.upload=function(fileURL,win,fail,id){
    
    
      var options = new FileUploadOptions();
      options.fileKey = "uploadFile";
      options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
      options.mimeType = "text/plain";
     
      var params = {};
      params.id = id;

      options.params = params;

      var ft = new FileTransfer();
      ft.onprogress = function(progressEvent) {
          if (progressEvent.lengthComputable) {
            loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
          } else {
            loadingStatus.increment();
          }
      };
      ft.upload(fileURL, encodeURI(serverURL), win, fail, options);
  }
    return FileFactory;
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
                  var promise1=AccountFactory.setUser(respUser.data);
                  var promise2= AccountFactory.getToken();
                   
                  $q.all([promise1,promise2]).then(function(){
                    return true;
                  });
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
            LocalStorage.set('EZ_LOCAL_TOKEN',resp.data.token);
            return resp.data.token;
        });
        }
      AccountFactory.getUser =function (){
         console.log('gerUser Start!');
         var d = $q.defer();
        if(AccountFactory.user){
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
              LocalStorage.get('EZ_LOCAL_TOKEN',function(data){
                if(data){
                      console.log('GET User by login with token'+data);
                        $http.get("http://localhost:1337/auth/loginWithToken?access_token="+data)
                        .then(
                              function(resp){
                                   
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
             });
            
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
      AccountFactory.editDish = function(id,att,val){
          return $http.get("http://localhost:1337/dish/update/"+ id+"?"+att+'='+val)
          .then(
                function(resp){
                    return resp.data;
                }
          );
      }
      AccountFactory.editRestaurant = function(id,att,val){
          return $http.get("http://localhost:1337/Restaurant/update/"+ id+"?"+att+'='+val)
          .then(
                function(resp){
                    return resp.data;
                }
          );
        }
          
      AccountFactory.getQRSrc = function(id){
          return "http://localhost:1337/restaurant/getQRcode?id=" + id;

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
      AccountFactory.getOrder = function(id){
        return $http.get('http://localhost:1337/order/'+id)
            .then(
                  function(resp){
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

