angular.module("comicsApp", ["comicsApp.controllers"]);




angular.module("comicsApp.controllers", ["comicFilters","comicsFactories"]).
  controller("comicsCtrl", ["$scope", "$http",
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
          $scope.sort = ["title","issue","-grade"]; 
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
        $http.post("/data/index.php", angular.toJson(items)).success(function(){
          return;
        }); 
      }; 
      $scope.addSale = function(sale) {
        $scope.sales.push(_.clone(sale));
        for (var val in sale){
          if (sale.hasOwnProperty(val)){
            delete sale[val];  
          }
        }
      };
      $scope.sorter = function(sort){
        if ($scope.sort[0].indexOf(sort) >-1 && $scope.sort[0].charAt(0) === "-" ) {
          $scope.sort[0] = sort.slice(1);
        }
        if ($scope.sort[0].indexOf(sort) >-1 && $scope.sort[0].indexOf("-") === -1 ) {
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
  ]).controller("recordCtrl", ["$scope","dataService",
    function( $scope, dataService )  {
      "use strict"; 
      $scope.items = dataService;
      $scope.sort = "-price";
      $scope.sorter = function(sort){
        if ($scope.sort.indexOf(sort) >-1 && $scope.sort.charAt(0) === "-" ) {
          $scope.sort = sort.slice(1);
        }
        if ($scope.sort.indexOf(sort) >-1 && $scope.sort.indexOf("-") === -1 ) {
          $scope.sort = "-"+sort;
        } else {
          $scope.sort = sort;
        }
      }; 
    }
  ]).controller("chartCtrl", ["$scope","dataService",
    function( $scope, dataService )  {
      "use strict";    
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
  ]).controller("recordCtrl", ["$scope","dataService",
    function( $scope, dataService )  {
      "use strict";
      $scope.items = dataService;
      $scope.sort = "-price";
      $scope.sorter = function(sort){
        if ($scope.sort.indexOf(sort) >-1 && $scope.sort.charAt(0) === "-" ) {
          $scope.sort = sort.slice(1);
        }
        if ($scope.sort.indexOf(sort) >-1 && $scope.sort.indexOf("-") === -1 ) {
          $scope.sort = "-"+sort;
        } else {
          $scope.sort = sort;
        }
      };
    }
  ]).controller("saCtrl", ["$scope", "$http",
    function( $scope , $http)  {
      "use strict";
      $http({"method" : "GET", "url" : "/data/sa-pedigrees.json"}).success(
        function(data){
          $scope.items = data.books;
          $scope.keys = data.keys;
        });     
    } 
  ]);

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
angular.module("comicsFactories", [])
  .factory("dataService", function ($http) {
    "use strict";
    var records = [];
    $http({"method" : "GET", "url" : "/data/books.json"}).success(
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
