angular.module('localStorageServices', [])

.factory('LocalStorage',  ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObj: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObj: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    },
    del : function(key) {
      delete $window.localStorage[key];
    },
    exist : function(key){
      if($window.localStorage[key]) return true;
      else return false;
    }
  }
}]);
