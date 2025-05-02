angular.module("comicsApp" )
  .controller("recordCtrl", ["$rootScope","$scope","dataService",
    function( $rootScope, $scope, dataService )  {
      "use strict";
            $scope.items = dataService.getRecords();
      $scope.sort = "-price";
      if (document.location.search !== null){
        $scope.search = document.location.search.slice(1,document.location.search.length);
      }
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
  ]);
