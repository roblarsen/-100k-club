angular.module('comicsApp', ['comicsApp.controllers']);




angular.module('comicsApp.controllers', ['comicFilters','comicsFactories']).
  controller('comicsCtrl', ["$scope", "$http",
    function( $scope , $http)  {
      "use strict";
      $http({"method" : "GET", "url" : "/data/books.json"}).success(
        function(data){
         $scope.items = data.books;
         var titles = [], pedigrees = [], publishers = [], venues = [];
         for (var i=0; i < $scope.items.length; i++){
            if (!_.contains(titles,$scope.items[i].title)){
              titles.push($scope.items[i].title);
            }
            if ($scope.items[i].pedigree){
              if (!_.contains(pedigrees,$scope.items[i].pedigree)){
                pedigrees.push($scope.items[i].pedigree);
              }         
            }
            if ($scope.items[i].publisher){
              if (!_.contains(publishers,$scope.items[i].publisher)){
                publishers.push($scope.items[i].publisher);
              }         
            }
            if ($scope.items[i].sales.length){
              for (var j=0; j < $scope.items[i].sales.length; j++){

                if (!_.contains(venues,$scope.items[i].sales[j].venue)){
                  venues.push($scope.items[i].sales[j].venue);
                }       
              }  
            }  
         }
        $scope.sort = ['title','issue','-grade']; 
        $scope.titles = titles;
        $scope.publishers = publishers;
        $scope.pedigrees = pedigrees; 
        $scope.venues = venues; 
        $scope.uid = data.books.length;
      });
      $scope.sales = [];
      $scope.addItem = function(item) { 
        item.sales = $scope.sales;
        item.uid = $scope.uid;
        $scope.uid++;

        $scope.items.push(item);
        $scope.item = {};
        $scope.sales = [];
        if (item.pedigree){
          if (!_.contains($scope.pedigrees,item.pedigree)){
            $scope.pedigrees.push(item.pedigree);
          }         
        }
        if (item.publisher){
          if (!_.contains($scope.publishers,item.publisher)){
            $scope.publishers.push(item.publisher);
          }         
        }
        if (!_.contains($scope.titles,item.title)){
          $scope.titles.push(item.title);
        }
        var items = $scope.items,
          len = items.length;
        for ( var i = 0; i <len; i++){
          delete items[i]["$$hashKey"];
        }
        $http.post('data/index.php', angular.toJson(items)).success(function(data){
        }); 
      }; 
      $scope.addSale = function(sale) {
        $scope.sales.push(_.clone(sale));
        for (var val in sale){
          delete sale[val];
        }
      };
      $scope.sorter = function(sort){
       if ($scope.sort[0].indexOf(sort) >-1 && $scope.sort[0].charAt(0) === "-" ) {
            $scope.sort[0] = sort.slice(1);
        }
        if ($scope.sort[0].indexOf(sort) >-1 && $scope.sort[0].indexOf("-") == -1 ) {
            $scope.sort[0] = "-"+sort; 
        } else {
          var tmp = [];
          tmp[0] = sort;
          for (var i=0; i < $scope.sort[0].length; i++ ) {
            if ($scope.sort[i] !== sort) {
              tmp.push($scope.sort[i]);
            }
          }
          $scope.sort = tmp;
        }     
      }; 
  }
]).controller('recordCtrl', ["$scope",'dataService',
    function( $scope, dataService )  {
    $scope.items = dataService;
    $scope.sort = "-price";
    $scope.sorter = function(sort){
      if ($scope.sort.indexOf(sort) >-1 && $scope.sort.charAt(0) === "-" ) {
        $scope.sort = sort.slice(1);
      }
      if ($scope.sort.indexOf(sort) >-1 && $scope.sort.indexOf("-") == -1 ) {
        $scope.sort = "-"+sort;
      } else {
         $scope.sort = sort;
      }
    }; 
  }
  
]).controller('chartCtrl', ["$scope",'dataService',
    function( $scope, dataService )  {
    $scope.items = dataService;
    $scope.tooltip = {
      price:0
    };
    $scope.updateTooltip = function(it) {
      $scope.tooltip = {
        price:it.price || 0,
        venue:it.venue,
        date:it.date,
        title:it.title,
        issue:it.issue,
        pedigree:it.pedigree,
        collection:it.collection,
        provenance:it.provenance,
        grade_src: it.grade_src,
        grade: it.grade
      }; 
    };
    $scope.colorPicker= function( venue ){

      switch (venue) {
        case "Heritage":
          return $scope.colors[0];
        case  "Comic Connect":
          return $scope.colors[1];
        case "Comiclink":
          return $scope.colors[2];
        case  "Pedigree":
          return $scope.colors[3];
        case "Metropolis":
          return $scope.colors[4];
        case  "JP The Mint":
          return $scope.colors[5];
        case "Mastronet":
          return $scope.colors[6];
        case  "PGCMint":
          return $scope.colors[7];
        default:
          return $scope.colors[8];
       }
     
    };
    $scope.colors = ["#ECD078","#D95B43","#C02942","#542437","#53777A","#69D2E7","#FA6900", "#FE4365","#666666"];
    
  }
  
]).controller('recordCtrl', ["$scope",'dataService',
    function( $scope, dataService )  {
    $scope.items = dataService;
    $scope.sort = "-price";
    $scope.sorter = function(sort){
       if ($scope.sort.indexOf(sort) >-1 && $scope.sort.charAt(0) === "-" ) {
            $scope.sort = sort.slice(1);
        }
        if ($scope.sort.indexOf(sort) >-1 && $scope.sort.indexOf("-") == -1 ) {
            $scope.sort = "-"+sort;
        } else {
            $scope.sort = sort;
        }
      };
  }
]).controller('saCtrl', ["$scope", "$http",
    function( $scope , $http)  {
      $http({"method" : "GET", "url" : "data/sa-pedigrees.json"}).success(
        function(data){
         $scope.items = data.books;
         $scope.keys = data.keys;
    });     
  }
]);

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
}).filter('saneDate', function () {
    "use strict";
    return function (input) {
      if (input){
        return input.replace(/-/g,"/");
      }
    };
}).filter('xDate', function () {
    "use strict";
    return function (input) {
        if (input !== undefined) {
          var date = input.split("-");
          var years = date[0] - 1993;
          var months = (years * 12) + parseInt(date[1]);
          return 90 + months * 3.3333;
          
        }
    };
}).filter('yPrice', function () {
    "use strict";
    return function (input) {
      if (input){
        return 579 - (input/4699.248120300752);
      }
    };
}).filter('otherVenues', function () {
    "use strict";
    return function (input) {
      console.log(input);
    };
});

/*!
 * Copyright 2013 Phil DeJarnett - http://www.overzealous.com
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Create a module for naturalSorting
angular.module("naturalSort", [])

// The core natural service
.factory("naturalService", ["$locale", function($locale) {
    "use strict";
        // the cache prevents re-creating the values every time, at the expense of
        // storing the results forever. Not recommended for highly changing data
        // on long-term applications.
    var natCache = {},
        // amount of extra zeros to padd for sorting
        padding = function(value) {
            return "00000000000000000000".slice(value.length);
        },

        // Calculate the default out-of-order date format (d/m/yyyy vs m/d/yyyy)
        natDateMonthFirst = $locale.DATETIME_FORMATS.shortDate.charAt(0) === "m",
        // Replaces all suspected dates with a standardized yyyy-m-d, which is fixed below
        fixDates = function(value) {
            // first look for dd?-dd?-dddd, where "-" can be one of "-", "/", or "."
            return value.replace(/(\d\d?)[-\/\.](\d\d?)[-\/\.](\d{4})/, function($0, $m, $d, $y) {
                // temporary holder for swapping below
                var t = $d;
                // if the month is not first, we'll swap month and day...
                if(!natDateMonthFirst) {
                    // ...but only if the day value is under 13.
                    if(Number($d) < 13) {
                        $d = $m;
                        $m = t;
                    }
                } else if(Number($m) > 12) {
                    // Otherwise, we might still swap the values if the month value is currently over 12.
                    $d = $m;
                    $m = t;
                }
                // return a standardized format.
                return $y+"-"+$m+"-"+$d;
            });
        },

        // Fix numbers to be correctly padded
        fixNumbers = function(value) {
            // First, look for anything in the form of d.d or d.d.d...
            return value.replace(/(\d+)((\.\d+)+)?/g, function ($0, integer, decimal, $3) {
                // If there's more than 2 sets of numbers...
                if (decimal !== $3) {
                    // treat as a series of integers, like versioning,
                    // rather than a decimal
                    return $0.replace(/(\d+)/g, function ($d) {
                        return padding($d) + $d;
                    });
                } else {
                    // add a decimal if necessary to ensure decimal sorting
                    decimal = decimal || ".0";
                    return padding(integer) + integer + decimal + padding(decimal);
                }
            });
        },

        // Finally, this function puts it all together.
        natValue = function (value) {
            if(natCache[value]) {
                return natCache[value];
            }
            natCache[value] = fixNumbers(fixDates(value));
            return natCache[value];
        };

    // The actual object used by this service
    return {
        naturalValue: natValue,
        naturalSort: function(a, b) {
            a = natVale(a);
            b = natValue(b);
            return (a < b) ? -1 : ((a > b) ? 1 : 0);
        }
    };
}])

// Attach a function to the rootScope so it can be accessed by "orderBy"
.run(["$rootScope", "naturalService", function($rootScope, naturalService) {
    "use strict";
    $rootScope.natural = function (field) {
        return function (item) {
            return naturalService.naturalValue(item[field]);
        };
    };
}]);

angular.module('comicsFactories', [])
    .factory('dataService', function ($http) {
      "use strict";
      var records = [];
         $http({"method" : "GET", "url" : "data/books.json"}).success(
            function(data){
            for (var i = 0, len = data.books.length; i < len; i++){
              if (data.books[i].sales.length){
                for (var j = 0, l = data.books[i].sales.length; j < l; j++){
                  if (parseFloat(data.books[i].sales[j].price) >= 100000){
                    records.push({
                      "title":data.books[i].title,
                      "issue": data.books[i].issue, 
                      "pedigree": data.books[i].pedigree,
                      "collection": data.books[i].collection,
                      "provenance": data.books[i].provenance,
                      "grade": data.books[i].grade,
                      "grade_src":data.books[i].grade_src,
                      "uid": Math.floor(data.books[i].uid),
                      "date":data.books[i].sales[j].sale_date,
                      "venue":data.books[i].sales[j].venue,
                      "price": Math.floor(data.books[i].sales[j].price),
                      "link":data.books[i].sales[j].link
                    });
                  }
                }
              }
            }
        });
      return records;
    });
