angular.module("comicsApp")
.directive("verticalLines", function() {
  "use strict";
  function link(scope, element, attrs) {
    var years = attrs.endYear - attrs.startYear;
    years++;
    var increment = 949 / years;
    scope.newXs = [];
    for (var i = 0; i < years; i++){
      scope.newXs.push((i * increment) + 75);
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
    for (var i = 0; i < prices; i++){
      scope.newYs.push((i * increment) + 25);
    }
    console.log(scope.newYs);
  }

  return {
    transclude: true,
    templateUrl: "_assets/partials/horizontal-lines.html",
    link: link
  };
});
