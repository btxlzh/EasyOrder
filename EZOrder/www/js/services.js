angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Andrew Jostlin',
    lastText: 'Did you get the ice cream?',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})
.factory('DataService',function($http){

      function getUrlVars(Url) {
          var vars = {};
          var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
          function(m,key,value) {
            vars[key] = value;
          });
          return vars;
      }

      var dataFactory = {};
      dataFactory.getAllRestaurants = function(){
          return $http.get('http://localhost:1337/restaurant/');
      } 
      dataFactory.getRestaurant = function(id){
          return $http.get('http://localhost:1337/restaurant/'+id); 
      }
      dataFactory.getRestaurantByQRCode = function(Image_data){
          return getUrlVars(Image_data.te)["id"];
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
          }
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

