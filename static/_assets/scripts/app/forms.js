//'myApp.filters', 'myApp.services', 'myApp.directives', 
angular.module('comicsApp', ['comicsApp.controllers']);
angular.module('comicsApp.controllers', ['comicFilters']).
  controller('comicsCtrl', ["$scope", "$http",
    function( $scope , $http)  {
      "use strict";
      $http({"method" : "GET", "url" : "/books"}).success(
        function(data){
           $scope.items = data.books;
           var titles = [], pedigrees = [], publishers = [], venues = [];
           for (var i=0; i < $scope.items.length; i++){
              if (!_.includes(titles,$scope.items[i].title)){
                titles.push($scope.items[i].title);
              }
              if ($scope.items[i].pedigree){
                if (!_.includes(pedigrees,$scope.items[i].pedigree)){
                  pedigrees.push($scope.items[i].pedigree);
                }         
              }
              if ($scope.items[i].publisher){
                if (!_.includes(publishers,$scope.items[i].publisher)){
                  publishers.push($scope.items[i].publisher);
                }         
              }
              if ($scope.items[i].sales.length){
                for (var j=0; j < $scope.items[i].sales.length; j++){

                  if (!_.includes(venues,$scope.items[i].sales[j].venue)){
                    venues.push($scope.items[i].sales[j].venue);
                  }       
            
                }  
              }  
           }
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
          if (!_.includes($scope.pedigrees,item.pedigree)){
            $scope.pedigrees.push(item.pedigree);
          }         
        }
        if (item.publisher){
          if (!_.includes($scope.publishers,item.publisher)){
            $scope.publishers.push(item.publisher);
          }         
        }
        if (!_.includes($scope.titles,item.title)){
          $scope.titles.push(item.title);
        }
        var items = $scope.items,
          len = items.length;
        for ( var i = 0; i <len; i++){
          delete items[i]["$$hashKey"];
          for ( var j = 0; j <items[i].sales.length; i++){
            delete items[i].sales[j]["$$hashKey"];
          }
        }
        $http.post('/books', JSON.stringify(items)).success(function(){console.log("200");
        }); 
      };
      $scope.addSale = function(sale) {
        $scope.sales.push(_.clone(sale));
        for (var val in sale){
          delete sale[val];
        }
      };
  }
]);
angular.module('comicFilters', []).filter('srcFilter', function() {
  "use strict";
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
