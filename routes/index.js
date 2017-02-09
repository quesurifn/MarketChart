var express = require('express');
var yahooFinance = require('yahoo-finance');
var mongoose = require('mongoose');
var moment = require('moment');
var Stocks = require('../models/stocks');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


router.get('/api/stocks', function(req, res) {
  Stocks.find(function (err, stocks) {
    if (err) { // if there is an error
      res.send(err); // send the error
    } else { //if everything goes well
       // scope the quotes
       console.log(stocks);
       updatedStocks = [];
       for (var i =0; i< stocks.length ;i++) {
         console.log(stocks[i].stock);
         updatedStocks.push(stocks[i].stock);
       }
       console.log(updatedStocks);
      yahooFinance.historical({
        symbols: updatedStocks,
        from: moment().subtract(2, 'years').format("YYYY-MM-DD"),
        to: moment().format("YYYY-MM-DD")
      }, function (err, quotes) {
        if (err) {
          console.log(err);
        } else {
                var series = [];
                   //construct series array (array of objects for each stock) for HighStocks
                   for (var key in quotes) {
                   //quotes is the JSON object returned from the Yahoo API call
                   //With an object for each stock
                     var dataSeries = [];
                     //construct dataSeries object with an array of arrays for each day, used in High Stocks
                     for (var i = 0; i < quotes[key].length; i++) {
                     //loop through quotes JSON Object for each key/Stock
                       var date = Date.parse(quotes[key][i].date);
                       var object = [date, quotes[key][i].close];
                       dataSeries.push(object);
                     }
                     series.push({
                       name: key,
                       data: dataSeries
                     });
                   } //for loop
                   console.log(series);
                   res.status(200).json(series);
                 }
               }); // yahooFinance.historical
           }
         }); //db.collection(STOCKS_COLLECTION)
       }); // app.get("/quotes/"

router.post('/api/stocks', function(req, res) {
  console.log(req.body.text);
  Stocks.create({
    stock: req.body.text, //stocks
    date_added: new Date(), //Date
  }, function (err, stocks) {
    if (err) {
      res.send(err);
    } else {
      Stocks.find(function(err, stocks) {
        if (err) {
          res.send(err);
        } else {
          res.json(stocks);
          console.log(stocks);
        }
      });
    };
  });
});

router.delete('/api/stocks/:stocks_id', function(req, res) {
  Stocks.remove({
    _id : req.params.stocks_id
  }, function(err, stocks) {
    if (err) {
      res.send(err);
    } else {
      Stocks.find(function(err, stocks) {
        if(err) {
          res.send(err);
        } else {
          res.json(stocks);
        }
      });
    }
  });
});


module.exports = router;
