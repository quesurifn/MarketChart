var seriesOptions = [],
    seriesCounter = 0;

function createChart() {
  Highcharts.stockChart('chart', {

      rangeSelector: {
      selected: 4
        },

          yAxis: {
            labels: {
              formatter: function () {
                return (this.value > 0 ? ' + ' : '') + this.value + '%';
            }
          },
          plotLines: [{
          value: 0,
          width: 2,
          color: 'silver'
          }]
      },

      plotOptions: {
      series: {
      compare: 'percent',
      showInNavigator: true
      }
    },

    tooltip: {
    pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
    valueDecimals: 2,
    split: true
    },

    series: seriesOptions
  });
}

$.getJSON('/api/stocks',    function (data) {
  seriesOptions = data;
  // As we're loading the data asynchronously, we don't know what order it will arrive. So
  // we keep a counter and create the chart when all the data is loaded.
  seriesCounter += 1;
  createChart();
});


var stocks = [];
var list = [];

//   Get Symbols for initial load
//

//Make stock to send off to DB
//
function makeStock( data ) {
  return {
    date_added : new Date(),
    symbol     : data.symbol,
    id         : data.id
  }
}

var stocksComponent = {
  controller : function(){
    return {
      symbol : m.prop('')
    }
  },

  view : function( ctrl ){
    return [
      m('input', {
        onchange: m.withAttr('value', ctrl.symbol),
        value: ctrl.symbol()
      }),

m('button.btn.btn-active.btn-primary', {
  onclick: function(){
    if( ctrl.symbol() )
    m.request( {method: 'POST',
      url: '/api/stocks',
      data: { text : symbol.toUpperCase() },
    } ).then(function(list) {
      stocks.push(list)
      console.log(stocks);
      return list.map(function( item ){
        return makeStock( { symbol : item.stock } )
      } )
    } )

}) //m button

    ctrl.symbol('')
  }
}, 'Add Stock'),

m('ul',
  stocks.map(function(item) {
    return m("li",
      m('p', item.symbol)
        )
      })
    )
  ]
}



m.mount(document.getElementById('app'), stocksComponent)
