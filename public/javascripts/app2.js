// Model data
var seriesData = []

// Model functions
function addToSeries(data){
  seriesData.push.apply(seriesData,data)
}

function makeStock( data ) {
  return {
    date_added : new Date(),
    symbol     : data.symbol,
    id         : data.id
  }
}

// View data
var chartConfig = {
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

  series: [{
    name: 'Kyle\'s Chart',
    data: seriesData
  }]
}

// Components
var chartComponent = {
  view : function(ctrl) {
    return m("#plot[style=height:400px]", {
      config: function(elem,isin) {
        if(!isin)
          Highcharts.StockChart(elem, chartConfig)
      }
    })
  }
}

var todosComponent = {
  var stocks = [];
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
}

// UI initialisation
m.mount(document.getElementById('chart'), chartComponent)
m.mount(document.getElementById('app'), todosComponent)
