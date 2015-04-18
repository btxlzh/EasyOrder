
var app = angular.module('ionicApp', ['ionic','Controllers','ngCordova'])

app.config(function($stateProvider, $urlRouterProvider) {


  $stateProvider.state('app', {
    abstract: true,
    templateUrl: 'views/main.html'
  })

  $stateProvider.state('app.search', {
    abstract: true,
    url: '/search',
    views: {
      search: {
        template: '<ion-nav-view></ion-nav-view>'
      }
    }
  })

    $stateProvider.state('app.search.index', {
    url: '',
    templateUrl: '/views/search.html',
    controller: 'SearchCtrl'
  })

  $stateProvider.state('app.search.detail', {
    url: '/:id',
    templateUrl: '/views/detail.html',
    controller: 'DetailCtrl',
    resolve: {
      id: function($stateParams) {
        return $stateParams.id
      }
    }
  })


  $stateProvider.state('app.scan', {
    url: '/scan',
    views: {
      scan: {
        templateUrl: 'views/scan.html'
      }
    }
  })

  $urlRouterProvider.otherwise('/search')
})

app.factory('searchService', function() {
  var search = [
      {title: "Take out the trash", done: true},
      {title: "Do laundry", done: false},
      {title: "Start cooking dinner", done: false}
   ]

  return {
    search: search,
    getTodo: function(index) {
      return search[index]
    }
  }
})