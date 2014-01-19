angular.module('comicsApp.controllers', ['comicFilters','comicsFactories']).
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
        $http.post('data/index.php', angular.toJson(items)).success(function(data){console.log("200");
        }); 
      } 
      $scope.addSale = function(sale) {
        $scope.sales.push(_.clone(sale));
        for (var val in sale){
          delete sale[val];
        }
      }
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
      	
      	
      } 
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
      	
      	
      } 
	}
	
]).controller('chartCtrl', ["$scope",'dataService',
    function( $scope, dataService )  {
    $scope.items = dataService;
    $scope.tooltip = {
      price:0,
      venue:"",
      date:""
    }
    $scope.updateTooltip = function(price,date,venue,x,y) {
      $scope.tooltip = {
        price:price,
        venue:venue,
        date:date
      } 
    }
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
     
    }
    $scope.colors = ["#ECD078","#D95B43","#C02942","#542437","#53777A","#69D2E7","#FA6900", "#FE4365","#666666"];
    
  }
  
]);