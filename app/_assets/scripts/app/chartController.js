angular.module("comicsApp" ).
  controller("chartCtrl", ["$rootScope","$scope","dataService",
    function( $rootScope, $scope, dataService )  {
      "use strict";
      $scope.items = dataService.getRecords();
      $scope.tooltip = {
        price:0
      };
      $scope.startYear = 1990;
      $scope.endYear = moment().add(1,"year").year();
      $scope.baseline = 0;
      $scope.maxPrice = 3500000;
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
          gradeSrc: it.gradeSrc,
          grade: it.grade
        };
      };
      $scope.colorPicker= function( venue ){
        venue = venue.toLowerCase();
        if ($scope.colors[venue]){
          return $scope.colors[venue];
        }
        else {
          return $scope.colors.default;
        }
      };
      $scope.colors = {
        "heritage":"#ECD078",
        "comicconnect":"#D95B43",
        "comiclink":"#C02942",
        "pedigreecomics":"#542437",
        "metropolis":"#53777A",
        "default":"#666666"
      };
    }
  ]);
