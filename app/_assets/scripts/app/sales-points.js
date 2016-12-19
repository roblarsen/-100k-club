angular.module("comicsApp")
.directive("salesPoints", function() {
  "use strict";
  function link(scope, element, attrs) {
    var priceRange = attrs.maxPrice - attrs.baseline;
    var priceIncrement = priceRange/650;
    var totalYears = attrs.endYear - attrs.startYear;
    totalYears++;
    var totalMonths = totalYears * 12;
    var monthIncrement = 950 / totalMonths;
    scope.xDate = function ( input ) {
      if (input) {
        var date = input.split("-");
        var years = date[0] - attrs.startYear;
        var months = (years * 12) + parseInt(date[1]);
        return 73 + (months * monthIncrement);
      } 
        
    };
    scope.yPrice = function ( input ) {
      if (input){
        return 675 - (input/priceIncrement);
      }
    };
  }
  return {
    transclude: true,
    templateUrl: "_assets/partials/sales-points.html",
    link: link
  };
});
