angular.module('comicFilters', []).filter('srcFilter', function() {
  return function(input) {
    if (input === 'cgc' || input === 'pgx' ) {
      input = input.toUpperCase();
    }
    return input;
  };
}).filter('capitalize', function () {
    "use strict";
    return function (input) {
      if (input){
        return input.charAt(0).toUpperCase() + input.slice(1);
      }
    };
});