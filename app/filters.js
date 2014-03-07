angular.module("comicFilters", []).filter("srcFilter", function() {
  return function(input) {
    if (input === "cgc" || input === "pgx" ) {
      input = input.toUpperCase();
    }
    return input;
  };
}).filter("capitalize", function () {
  "use strict";
  return function (input) {
    if (input){
      return input.charAt(0).toUpperCase() + input.slice(1);
    }
  };
}).filter("saneDate", function () {
  "use strict";
  return function (input) {
    if (input){
      return input.replace(/-/g,"/");
    }
  };
}).filter("xDate", function () {
  "use strict";
  return function (input) {
    if (input !== undefined) {
      var date = input.split("-");
      var years = date[0] - 1993;
      var months = (years * 12) + parseInt(date[1]);
      return 90 + months * 3.3333;
    }
  };
}).filter("yPrice", function () {
  "use strict";
  return function (input) {
    if (input){
      return 579 - (input/4699.248120300752);
    }
  };
});