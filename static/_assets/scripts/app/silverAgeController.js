angular.module("comicsApp").controller("saCtrl", ["$scope", "$http",
    function( $scope , $http)  {
      "use strict";
      $http({"method" : "GET", "url" : "/data/sa-pedigrees.json"}).success(
        function(data){
          $scope.items = data.books;
          $scope.keys = data.keys;
        });
    }
  ]);
