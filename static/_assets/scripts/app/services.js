angular.module("comicsFactories", [])
  .factory("dataService", function ($http) {
    "use strict";
    function getRecords() {
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
                    "gradeSrc":data.books[i].gradeSrc,
                    "date":data.books[i].sales[j].salesDate,
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
    }
    return {
      getRecords: getRecords
    };
  });
