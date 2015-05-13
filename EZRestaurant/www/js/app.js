// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','localStorageServices','ngCordova'])
.config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.withCredentials = true;

}])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.order', {
    url: '/order',
    views: {
      'tab-order': {
        templateUrl: 'templates/order.html',
        controller: 'OrderCtrl'
      }
    }
  })
  .state('tab.orderdetail', {
    url: '/order/:id',
    
    views: {
       'tab-order': {
            templateUrl: 'templates/orderdetail.html',
            controller: 'OrderDetailCtrl', 
          }
    },
    resolve : {

    }
    
  })
  .state('tab.dish', {
    url: '/dish/:id',
    
    views: {
       'tab-restaurant': {
            templateUrl: 'templates/restaurant-dish.html',
            controller: 'RestaurantDishCtrl', 
          }
    },
    resolve : {
         dish_data : function(AccountService,$stateParams) {
                 return AccountService.getDish($stateParams.id);
         }
    }
    
  })
   .state('tab.menu', {
    url: '/menu/:id',
    views: {
       'tab-restaurant': {
            templateUrl: 'templates/restaurant-menu.html',
            controller: 'RestaurantMenuCtrl', 
          }
    },
    resolve : {
         menu_data : function(AccountService,$stateParams) {
                return AccountService.getMenu($stateParams.id);
        }
    },
  })
  .state('tab.restaurant', {
      url: '/restaurant',
      views: {
        'tab-restaurant': {
          templateUrl: 'templates/restaurant.html',
          controller: 'RestaurantCtrl',
        }
      }
    })
  // .state('tab.restaurantedit', {
  //     url: '/restaurantedit',
  //     views: {
  //       'tab-restaurant': {
  //         templateUrl: 'templates/restaurantedit.html',
  //         controller: 'RestaurantEditCtrl',
  //       }
  //     },
  //   })
  .state('login', {
    url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
  })


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/restaurant');

})
;