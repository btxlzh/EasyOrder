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
     // $scope.restaurants = [];
     // var one = {id:1, name: 'apoplo', type: 'chinese'};
     // $scope.restaurants.push(one);

    $scope.$on('$ionicView.beforeEnter', function(){
      DataService.getAllRestaurants()
      .success(function(resp){
          $scope.restaurants = resp;
      })
      .error(function(error){
           ErrorService.popUp("unable to get restaurants data from server");
      });
    });
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
.controller("ProfileCtrl",function($scope,$http,$state,AccountService,$ionicModal,$ionicHistory,uploadFile,$cordovaCamera, $cordovaImagePicker,$timeout, $cordovaFile){
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
    var serverURL = "http://localhost:1337/file/upload";
    $scope.takePicture = function() {
      var options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 100,
        targetHeight: 100,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {
        var image = document.getElementById('profile-image');
        image.src = "data:image/jpeg;base64," + imageData;
        alert(image.src);
      }, function(err) {
        // error
      });
  };

  $scope.choose = function() { 
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    };
    $cordovaCamera.getPicture(options).then(
    function(imageURI) {
      window.resolveLocalFileSystemURI(imageURI, function(fileEntry) {
        $scope.picData = fileEntry.nativeURL;
        $scope.ftLoad = true;
        //var image = document.getElementById('myImage');
        
        upload(fileEntry.nativeURL);
        });
      $ionicLoading.show({template: 'Loading', duration:500});
    },
    function(err){
      $ionicLoading.show({template: 'Error', duration:500});
    })
  };
    
  upload = function(fileURL){
    var win = function (r) {
          baseURL = "http://localhost:1337/images/";
          console.log("Code = " + r.responseCode);
          console.log("Response = " + r.response);
          console.log("Sent = " + r.bytesSent);
          $scope.modalPic.hide();
          AccountService.editUser('photoUrl',baseURL+$scope.user.id+"_profile.jpg").then(function(data){
            $scope.user.photoUrl = baseURL+$scope.user.id+"_profile.jpg";

          });
      }

      var fail = function (error) {
          alert("An error has occurred: Code = " + error.code);
          console.log("upload error source " + error.source);
          console.log("upload error target " + error.target);
          $scope.modalPic.hide();
      }
      var options = new FileUploadOptions();
      options.fileKey = "uploadFile";
      options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
      options.mimeType = "text/plain";
     
      var params = {};
      params.id = $scope.user.id;

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


    $ionicModal.fromTemplateUrl('changeNameModal.html', {
      scope: $scope,
      animation: 'slide-in-up',
      backdropClickToClose : true
    }).then(function(modal) {
      $scope.modalName = modal
    })  

    $ionicModal.fromTemplateUrl('changePhoneModal.html', {
      scope: $scope,
      animation: 'slide-in-up',
      backdropClickToClose : true
    }).then(function(modal) {
      $scope.modalPhone = modal
    })  
    $ionicModal.fromTemplateUrl('changePicModal.html', {
      scope: $scope

    }).then(function(modal) {
      $scope.modalPic = modal
    })  
    $ionicModal.fromTemplateUrl('imageModal.html', {
      scope: $scope,
    }).then(function(modal) {
      $scope.modalImage = modal
    })  
    $scope.showImage = function() {
      $scope.imageSrc = $scope.user.photoUrl;
      $scope.openModal(3);
    }
    $scope.finishChangeName = function(newName){
      $scope.user.nickName = newName;
      AccountService.editUser('nickName',newName);
      $scope.modalName.hide();
    }
    $scope.finishChangePhone = function(newPhone){
      $scope.user.phoneNumber= newPhone;
      AccountService.editUser('phoneNumber',newPhone);
       $scope.modalPhone.hide();
    }
    $scope.openModal = function(mode) {
        switch(mode) {
          case 0: 
           $scope.modalName.show();
           break;
          case 1:
            $scope.modalPhone.show();
            break;
            case 2:
            $scope.modalPic.show();
            break;
          case 3:
          $scope.modalImage.show();
            break;
        }
    }
    $scope.closeModal = function(mode) {
        switch(mode) {
          case 0: 
           $scope.modalName.hide();
           break;
          case 1:
            $scope.modalPhone.hide();
            break;
            case 2:
          $scope.modalPic.hide();
            break;
          case 3:
          $scope.modalImage.hide();
            break;
        }
    };

    $scope.$on('$destroy', function() {
      $scope.modalName.remove();
      $scope.modalPhone.remove();
      $scope.modalPic.remove();
      $scope.modalImage.remove();
    });
}); 