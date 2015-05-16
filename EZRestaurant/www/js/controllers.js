angular.module('starter.controllers', ['ionic', 'ngCordova'])
    .controller("OrderCtrl", function($scope, $cordovaBarcodeScanner, $http, $state, ErrorService) {
        $scope.orders = [];
        $scope.listen = function() {
            io.socket.get('/Order/listenOrder', function serverResponded(body, JWR) {

                // JWR ==> "JSON WebSocket Response"
                console.log('Sails responded with: ', body);
                console.log('with headers: ', JWR.headers);
                console.log('and with status code: ', JWR.statusCode);
            });
        }
        io.socket.on('order', function onServerSentEvent(obj) {
            if (obj.verb === 'created') {
                console.log(obj.data);
                $scope.orders.push(obj.data);
                // Add the data to current chatList
                // Call $scope.$digest to make the changes in UI
                $scope.$digest();
            }
        });
        $scope.confirm = function(index) {
            console.log($scope.orders[index].status);
            $scope.orders[index].status = "confirm";
            console.log($scope.orders[index].status);
        }
        $scope.complete = function(index) {
            $scope.orders.splice(index, 1)
        }



    })


.controller('OrderDetailCtrl', function($scope, $stateParams, AccountService) {
    $scope.$on('$ionicView.beforeEnter', function() {
        AccountService.getOrder($stateParams.id).then(function(data) {
            $scope.order = data;
            console.log(data);
        }, function(err) {})
    });
})

.controller('LoginCtrl', function($q, $scope, $http, $state, $ionicPopup, $ionicHistory, AccountService, ErrorService, LocalStorage) {

        $scope.postData = {};
        $scope.login = function() {
            AccountService.login($scope.postData).then(function(data) {

                $state.go('tab.restaurant');
            }, function(err) {
                ErrorService.popUp("WRONG email OR password!");
            })
            return;
        }
    })
    .controller('RestaurantCtrl', function($ionicModal, $scope, $http, $state, $ionicHistory, AccountService, LocalStorage) {

        $scope.$on('$ionicView.beforeEnter', function() {
            AccountService.getUser().then(function(data) {
                $scope.restaurant = data;
                console.log(data);
            }, function(err) {
                $ionicHistory.nextViewOptions({
                    disableAnimate: true,
                    disableBack: true
                });
                $state.go('login');
            })
        });

        $ionicModal.fromTemplateUrl('changeNameModal.html', {
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: true
        }).then(function(modal) {
            $scope.modalName = modal
        })
        $ionicModal.fromTemplateUrl('changePriceModal.html', {
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: true
        }).then(function(modal) {
            $scope.modalPrice = modal
        })
        $ionicModal.fromTemplateUrl('changeDescriptionModal.html', {
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: true
        }).then(function(modal) {
            $scope.modalDescription = modal
        })
        $scope.openModal = function(mode) {
            switch (mode) {
                case 0:
                    $scope.modalName.show();
                    break;
                case 1:
                    $scope.modalPrice.show();
                    break;
                case 2:
                    $scope.modalDescription.show();
                    break;
                case 3:
                    $scope.modalImage.show();
                    break;
            }
        }
        $scope.closeModal = function(mode) {
            switch (mode) {
                case 0:
                    $scope.modalName.hide();
                    break;
                case 1:
                    $scope.modalPrice.hide();
                    break;
                case 2:
                    $scope.modalDescription.hide();
                    break;
                case 3:
                    $scope.modalImage.hide();
                    break;
            }
        };
        $scope.changeName = function(newName) {
            $scope.restaurant.name = newName;
            AccountService.editRestaurant($scope.restaurant.id, 'name', newName);
            $scope.modalName.hide();
        }
        $scope.changePrice = function(newPrice) {
            $scope.restaurant.price = newPrice;
            AccountService.editRestaurant($scope.restaurant.id, 'price', newPrice);
            $scope.modalPrice.hide();
        }
        $scope.changeDescripthon = function(newDescription) {
            $scope.restaurant.description = newDescription;
            AccountService.editRestaurant($scope.restaurant.id, 'description', newDescription);
            $scope.modalDescription.hide();
        }


        $scope.logout = function() {
            AccountService.logout()
                .success(function(resp) {
                    $state.go('login');
                    // For JSON responses, resp.data contains the result
                });


        }
    })





.controller("RestaurantQRCodeCtrl", function($stateParams, $scope, AccountService) {
        $scope.restaurant = AccountService.restaurant;
        console.log(AccountService.restaurant);
        $scope.qrSrc = AccountService.getQRSrc($stateParams.id);
    })
    .controller("RestaurantMenuCtrl", function($q, $scope, $state, $http, $stateParams, ErrorService, AccountService) {
        $scope.$on('$ionicView.beforeEnter', function() {
            AccountService.getMenu($stateParams.id).then(function(data) {
                $scope.menu = data;
            }, function(err) {})
        });
        $scope.listCanSwipe = true;
        $scope.add = function() {
            AccountService.createDish(AccountService.menu.id).then(function callback(data) {
                console.log(data);
                $state.go('tab.dish', {
                    id: data.id
                });
            })
        }
        $scope.delete = function(index) {

            AccountService.deleteDish($scope.menu.dishes[index].id).then(function callback(data) {
                $scope.menu.dishes.splice(index, 1);
            })
        }

    })
    .controller("RestaurantDishCtrl", function($scope, $http, dish_data, ErrorService, $ionicModal, AccountService, FileService, $cordovaCamera, $ionicLoading, $timeout) {
        $scope.dish = dish_data;
        $scope.baseURL = "http://localhost:1337/images/";

        $scope.image_srcs = dish_data.image_urls;

        $ionicModal.fromTemplateUrl('changeNameModal.html', {
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: true
        }).then(function(modal) {
            $scope.modalName = modal
        })
        $ionicModal.fromTemplateUrl('changePriceModal.html', {
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: true
        }).then(function(modal) {
            $scope.modalPrice = modal
        })
        $ionicModal.fromTemplateUrl('changeDescriptionModal.html', {
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: true
        }).then(function(modal) {
            $scope.modalDescription = modal
        })
        $ionicModal.fromTemplateUrl('addPicModal.html', {
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: true
        }).then(function(modal) {
            $scope.modalImage = modal
        })
        $scope.openModal = function(mode) {
            switch (mode) {
                case 0:
                    $scope.modalName.show();
                    break;
                case 1:
                    $scope.modalPrice.show();
                    break;
                case 2:
                    $scope.modalDescription.show();
                    break;
                case 3:
                    $scope.modalImage.show();
                    break;
            }
        }
        $scope.closeModal = function(mode) {
            switch (mode) {
                case 0:
                    $scope.modalName.hide();
                    break;
                case 1:
                    $scope.modalPrice.hide();
                    break;
                case 2:
                    $scope.modalDescription.hide();
                    break;
                case 3:
                    $scope.modalImage.hide();
                    break;
            }
        };

        $scope.changeName = function(newName) {
            $scope.dish.name = newName;
            AccountService.editDish(dish_data.id, 'name', newName);
            $scope.modalName.hide();
        }
        $scope.changePrice = function(newPrice) {
            $scope.dish.price = newPrice;
            AccountService.editDish(dish_data.id, 'price', newPrice);
            $scope.modalPrice.hide();
        }
        $scope.changeDescripthon = function(newDescription) {
            $scope.dish.description = newDescription;
            AccountService.editDish(dish_data.id, 'description', newDescription);
            $scope.modalDescription.hide();
        }
        var fail = function(error) {
            alert("An error has occurred: Code = " + error.code);
            console.log("upload error source " + error.source);
            console.log("upload error target " + error.target);
            $scope.modalImage.hide();
        }
        var success = function(r) {
            console.log("Code = " + r.responseCode);
            console.log("Response = " + r.response);
            console.log("Sent = " + r.bytesSent);
            $scope.modalImage.hide();
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            $timeout(function() {
                $ionicLoading.hide();

                if (dish_data.image_urls == null) {
                    dish_data.image_urls = [];
                }
                dish_count = dish_data.image_urls.length;
                filename = dish_data.id + "_" + dish_count + "_dish.jpg";
                AccountService.addDishPic(dish_data.id, filename).then(function(data) {
                    dish_data.image_urls.push(filename);

                    $scope.image_urls.push($scope.baseURL + filename);
                });

            }, 2000);

        }

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
                        dish_count = 0;
                        console.log("before upload: image_urls: " + dish_data.image_urls);
                        if (dish_data.image_urls != null) {
                            dish_count = dish_data.image_urls.length;
                        }
                        filename = dish_data.id + "_" + dish_count + "_dish.jpg";
                        FileService.upload("http://localhost:1337/file/upload", fileEntry.nativeURL, filename, success, fail);
                    });
                },
                function(err) {
                    $ionicLoading.show({
                        template: 'Error',
                        duration: 500
                    });
                })
        };

<<<<<<< HEAD
    });
=======
    })
>>>>>>> xuke
