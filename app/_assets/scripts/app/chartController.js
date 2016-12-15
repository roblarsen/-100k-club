angular.module("comicsApp" ).
  controller("chartCtrl", ["$rootScope","$scope","dataService",
    function( $rootScope, $scope, dataService )  {
      "use strict";
      $scope.items = dataService.getRecords();
      console.log($rootScope);
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
          gradeSrc: it.gradeSrc,
          grade: it.grade
        };
      };
      $scope.colorPicker= function( venue ){

        switch (venue) {
          case "Heritage":
            return $scope.colors[0];
          case  "ComicConnect":
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
  ]);
