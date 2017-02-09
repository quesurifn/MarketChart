var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Stocks = new Schema({
  stock: String,
  date_added : Date
});

var Stocks = mongoose.model('Stocks', Stocks);

module.exports = Stocks;
