var express = require('express');
var app = express();

app.use(express.static('static'));

app.get('/data/books.json', function (req, res, next) {

  var options = {
    root: __dirname,
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };

  var fileName = "/data/books.json";
  res.sendFile(fileName, options, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    else {
      console.log('Sent:', fileName);
    }
  });

});
app.get('/data/sa-pedigrees.json', function (req, res, next) {

  var options = {
    root: __dirname,
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };

  var fileName = "/data/sa-pedigrees.json";
  res.sendFile(fileName, options, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    else {
      console.log('Sent:', fileName);
    }
  });

});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
})
