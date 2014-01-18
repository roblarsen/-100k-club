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
          var years = 20 - (2013 - date[0]);
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
