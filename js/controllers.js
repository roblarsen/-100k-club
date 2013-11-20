angular.module('comicsApp.controllers', ['comicFilters']).
  controller('comicsCtrl', ["$scope", "$http",
    function( $scope , $http)  {
      $http({"method" : "GET", "url" : "data/books.json"}).success(
        function(data){
         $scope.items = data.books;
         var titles = [], pedigrees = [], publishers = [], venues = [];
         for (var i=0; i < $scope.items.length; i++){
            if (!_.contains(titles,$scope.items[i].title)){
              titles.push($scope.items[i].title)
            }
            if ($scope.items[i].pedigree){
              if (!_.contains(pedigrees,$scope.items[i].pedigree)){
                pedigrees.push($scope.items[i].pedigree)
              }         
            }
            if ($scope.items[i].publisher){
              if (!_.contains(publishers,$scope.items[i].publisher)){
                publishers.push($scope.items[i].publisher)
              }         
            }
            if ($scope.items[i].sales.length){
              for (var j=0; j < $scope.items[i].sales.length; j++){

                if (!_.contains(venues,$scope.items[i].sales[j].venue)){
                  venues.push($scope.items[i].sales[j].venue)
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
            $scope.pedigrees.push(item.pedigree)
          }         
        }
        if (item.publisher){
          if (!_.contains($scope.publishers,item.publisher)){
            $scope.publishers.push(item.publisher)
          }         
        }
        if (!_.contains($scope.titles,item.title)){
          $scope.titles.push(item.title)
        }
        var items = $scope.items,
          len = items.length;
        for ( var i = 0; i <len; i++){
          delete items[i]["$$hashKey"];
        }
        $http.post('data/index.php', JSON.stringify(items)).success(function(data){console.log("200");
        }); 
      } 
      $scope.addSale = function(sale) {
        $scope.sales.push(_.clone(sale));
        for (var val in sale){
          delete sale[val];
        }
      }
      $scope.sorter = function(sort){
        console.log($scope);
      	if ($scope.sort[0] === sort) {
      		$scope.sort[0] = "-"+sort;
      	} else {
          var tmp = [];
          tmp[0] = sort;
          for (var i=0; i < $scope.sort[0].length; i++ ) {
            if ($scope.sort[i] !== sort) {
              tmp.push($scope.sort[i]);
            }
          }
        }
      	
      	$scope.sort = sort;
      } 
  }
])