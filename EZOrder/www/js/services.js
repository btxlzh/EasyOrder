angular.module('starter.services', [])

.factory('DataService', function($q,$http, AccountService, CONFIG) {
        function getRestaurantByQRCode(Url,cb_id ) {
            var vars = {};
            var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi,
                function(m, key, value) {
                    vars[key] = value;
                    cb_id(value);
                });
            return vars;
        }

        var dataFactory = {};
        dataFactory.cart = [];
        dataFactory.getAllRestaurants = function() {
            return $http.get(CONFIG.serverUrl + '/restaurant/');
        }
        dataFactory.getRestaurant = function(id) {
            return $http.get(CONFIG.serverUrl + '/restaurant/' + id)
                .then(
                    function(resp) {
                        dataFactory.restaurant = resp.data;
                        return resp.data;
                    },
                    function(err) {
                        return err;
                    }
                );
        }
        dataFactory.isFavorite = function(restaurant_id) {
            return $http.get(CONFIG.serverUrl + '/user/isFavorite?user=' + AccountService.user.id + "&restaurant=" + restaurant_id)
                .then(
                    function(resp) {
                        console.log(resp.data);
                        return resp.data;
                    },
                    function(err) {
                        console.log(err);
                        return err;
                    }
                );
        }
        dataFactory.addToFavorite = function(restaurant_id) {
            var requestData = {};
            requestData.user = AccountService.user.id;
            requestData.restaurant = restaurant_id;
            return $http.post(CONFIG.serverUrl + '/user/addToFavorite', requestData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(
                function(resp) {
                    console.log("addToFavorite: " + resp.data);
                    return resp.data;
                },
                function(err) {
                    console.log(err);
                    return err;
                }
            );
        }
        dataFactory.deleteFromFavorite = function(restaurant_id) {
            var requestData = {};
            requestData.user = AccountService.user.id;
            requestData.restaurant = restaurant_id;
            return $http.post(CONFIG.serverUrl + '/user/deleteFromFavorite', requestData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(
                function(resp) {
                    console.log("delete favorite: " + resp.data);
                    return resp.data;
                },
                function(err) {
                    console.log(err);
                    return err;
                }
            );
        }
        dataFactory.getFavoriateRestaurant = function() {
            return $http.get(CONFIG.serverUrl + '/User/getFavorite?user=' + AccountService.user.id)
                .then(
                    function(resp) {
                        console.log(resp.data);
                        dataFactory.favoriteRestaurants = resp.data[0].favoriteRestaurant;
                        //console.log("dataFactory.favoriteRestaurant: "+dataFactory.favoriteRestaurant);
                        return resp.data;
                    },
                    function(err) {
                        return err;
                    }
                );
        }
        dataFactory.getMenu = function(id) {
            return $http.get(CONFIG.serverUrl + '/menu/' + id + '/all')
                .then(
                    function(resp) {
                        console.log(resp.data);
                        dataFactory.menu = resp.data;
                        return resp.data;
                    },
                    function(err) {
                        console.log(err);
                        console.log(dataFactory.restaurant.menu);
                        return err;
                    }
                );
        }
        dataFactory.getDish = function(id) {
            return $http.get(CONFIG.serverUrl + '/dish/' + id)
                .then(
                    function(resp) {
                        console.log(resp.data);
                        return resp.data;
                    },
                    function(err) {
                        console.log(err);
                        return err;
                    }
                );
        }
        dataFactory.getRestaurantByQRCode = function(Image_data,fun) {
        }
        dataFactory.cart = {};
        dataFactory.addToCart = function(dish, num) {

            if (dish.id in dataFactory.cart) {
                dataFactory.cart[dish.id].num += parseInt(num);
                console.log("add exist");
                console.log(dataFactory.cart);


            } else {

                dish.num = parseInt(num);
                //push new
                dataFactory.cart[dish.id] = dish;
                console.log("new add");
                console.log(dataFactory.cart);
                // console.log(Cart.dishes);
                // console.log(Cart.dish_map);

            }
            return;
        }
        dataFactory.getCart = function() {
            return dataFactory.cart;
        }

        dataFactory.clearCart = function() {
            dataFactory.cart.length = 0;
            return;
        }
        dataFactory.checkout = function(tableId) {
            var requestData = {};
            if (AccountService.user) {
                requestData.user = AccountService.user.id;
            } else {
                requestData.user = 0;
            }
            requestData.tableId = tableId;
            requestData.dishes = dataFactory.cart;
            requestData.restaurant = dataFactory.restaurant.id;

            return $http.post(CONFIG.serverUrl + '/Order/create', requestData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(
                function(resp) {
                    console.log(resp.data);
                    return resp.data;
                },
                function(err) {
                    console.log(err);
                    return err;
                }
            );
        }
        return dataFactory;
    })
    .factory('AccountService', function($http, $ionicHistory, $q, LocalStorage, CONFIG) {
        var AccountFactory = {};
        AccountFactory.login = function(credential) {
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            return $http.post(CONFIG.serverUrl + "/auth/login/", credential)
                .then(
                    function(respUser) {
                        return $http.get(CONFIG.serverUrl + "/user/jwt")
                            .then(
                                function(respToken) {
                                    AccountFactory.setUser(respUser.data);
                                    return {
                                        user: respUser.data,
                                        token: respToken.data
                                    }
                                }
                            )
                    }
                );

        }
        AccountFactory.register = function(credential) {
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            return $http.post(CONFIG.serverUrl + "/auth/register/", credential)
                .then(
                    function(respUser) {
                        return respUser.data;
                    }
                );
        }
        AccountFactory.loginWithToken = function(token) {
            return
        }
        AccountFactory.logout = function() {
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            LocalStorage.del('EZ_LOCAL_TOKEN');
            delete AccountFactory.user;
            return $http.get(CONFIG.serverUrl + "/auth/logout");
        }
        AccountFactory.getToken = function() {
            return $http.get(CONFIG.serverUrl + "/user/jwt")
        }
        AccountFactory.getUser = function() {
            console.log('gerUser Start!');
            var d = $q.defer();
            if (AccountFactory.user) {
                console.log('exist user' + AccountFactory.user);
                d.resolve(AccountFactory.user);
            } else {
                console.log('user not exist');
                var ret;
                if (!LocalStorage.exist('EZ_LOCAL_TOKEN')) {
                    console.log('No local token');
                    d.reject('No local token');
                } else {
                    LocalStorage.get('EZ_LOCAL_TOKEN', function(data) {
                        if (data) {
                            $http.get(CONFIG.serverUrl + "/auth/loginWithToken?access_token=" + data)
                                .then(
                                    function(resp) {
                                        console.log('GET User by login with token' + data);
                                        AccountFactory.setUser(resp.data);
                                        d.resolve(resp.data);
                                    },
                                    function(err) {
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
        AccountFactory.setUser = function(user) {
            AccountFactory.user = user;
        }
        AccountFactory.editUser = function(att, val) {
            return $http.get(CONFIG.serverUrl + "/user/update/" + AccountFactory.user.id + "?" + att + '=' + val)
                .then(
                    function(resp) {
                        return resp.data;
                    }
                );
        }
        AccountFactory.checkLogin = function($scope, $state, $ionicHistory) {
            return AccountFactory.getUser().then(function(data) {
                $scope.user = data;
                var x = true;
                return x;
            }, function(err) {
                $ionicHistory.nextViewOptions({
                    disableAnimate: true,
                    disableBack: true
                });
                $state.go('tab.login');
                var x = false;
                return x;
            })
        }

        return AccountFactory;
    })
    .factory('ErrorService', function($ionicPopup) {
        var Error = {};
        Error.popUp = function(err) {
            $ionicPopup.alert({
                title: "error",
                template: err
            });
        }
        return Error;

    });