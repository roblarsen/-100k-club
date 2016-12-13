"use strict";
angular.module("comicFilters", []).filter("srcFilter", function() {
  return function(input) {
    if (input === "cgc" || input === "pgx" || input === "cbcs" ) {
      input = input.toUpperCase();
    }
    return input;
  };
}).filter("capitalize", function () {
  return function (input) {
    if (input){
      return input.charAt(0).toUpperCase() + input.slice(1);
    }
  };
}).filter("saneDate", function () {
  return function (input) {
    if (input && input.indexOf("1900") === -1){
      return input.replace(/-/g,"/");
    } else { 
      return "date unknown";
    }
  };
}).filter("xDate", function () {
  return function (input) {
    if (input !== undefined) {
      var date = input.split("-");
      var years = date[0] - 1990;
	    var months = (years * 12) + parseInt(date[1]);
	    return 64 + (months * 3);
    }
  };
}).filter("yPrice", function () {
  return function (input) {
    if (input){
      return 673 - (input/5263.15789473684);
    }
  };
});
