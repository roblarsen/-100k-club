angular.module("comicsApp" ).
  controller("comicsCtrl", ["$scope", "$http",
    function($scope , $http)  {
      "use strict";
      $http({"method" : "GET", "url" : "/data/books.json"}).success(
        function(data){
          $scope.items = data.books;
          var titles = [], pedigrees = [], publishers = [], venues = [];
          var item;
          for (var i=0; i < $scope.items.length; i++){
            item = $scope.items[i];
            if (!_.includes(titles,item.title)){
              titles.push(item.title);
            }
            if (item.pedigree){
              if (!_.includes(pedigrees,item.pedigree)){
                pedigrees.push(item.pedigree);
              }
            }
            if (item.publisher){
              if (!_.includes(publishers,item.publisher)){
                publishers.push(item.publisher);
              }
            }
            if (item.sales.length){
              for (var j=0; j < item.sales.length; j++){

                if (!_.includes(venues,item.sales[j].venue)){
                  venues.push(item.sales[j].venue);
                }
              }
            }
          }
          if (document.location.search !== null){
            $scope.search = document.location.search.slice(1,document.location.search.length);
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
  ]);
