angular.module("comicsApp")
.directive("verticalLines", function() {
  "use strict";
  function link(scope, element, attrs) {
    var years = attrs.endYear - attrs.startYear;
    years++;
    var increment = 949 / years;
    scope.newXs = [];
    var strokeWidth = 1;
    for (var i = 0; i < years; i++){
      if (i%5 === 0 ) {
        strokeWidth = 2;
      } else {
        strokeWidth = 1;
      }
      scope.newXs.push({x:(i * increment) + 75, strokeWidth:strokeWidth});
    }
  }

  return {
    transclude: true,
    templateUrl: "_assets/partials/vertical-lines.html",
    link: link
  };
}).directive("horizontalLines", function() {
  "use strict";
  function link(scope, element, attrs) {
    var priceRange = attrs.maxPrice - attrs.baseline;
    var prices = priceRange/100000;
    var increment = 650 / prices;
    scope.newYs = [];
    var strokeWidth = 1;
    for (var i = 0; i < prices; i++){
      if (i%5 === 0 ) {
        strokeWidth = 3;
      } else {
        strokeWidth = 1;
      }
      scope.newYs.push({y:(i * increment) + 25, strokeWidth:strokeWidth});
    }
  }

  return {
    transclude: true,
    templateUrl: "_assets/partials/horizontal-lines.html",
    link: link
  };
}).directive("yearLabels", function() {
  "use strict";
  function link(scope, element, attrs) {
    var years = attrs.endYear - attrs.startYear;
    years++;
    var increment = 949 / years;
    scope.years = [];
    for (var i = 0; i < years; i++){
      if (i%5 === 0 ) {
        scope.years.push({x:(i * increment) + 75, year:parseInt(attrs.startYear) + i});
      }
      
    }
  }

  return {
    transclude: true,
    templateUrl: "_assets/partials/year-labels.html",
    link: link
  };
}).directive("dollarLabels", function() {
  "use strict";
  function link(scope, element, attrs) {
    var priceRange = attrs.maxPrice - attrs.baseline;
    var prices = priceRange/100000;
    var increment = 650 / prices;
    scope.dollars = [];
    for (var i = 0; i <= prices; i++){
      if (i%5 === 0 ) {
        scope.dollars.push({y:(650 - (i * increment)) + 25, value:i*100000});
      }
    }
  }

  return {
    transclude: true,
    templateUrl: "_assets/partials/dollars.html",
    link: link
  };
});
