var app = {};

app.apiData = Array;
app.SymbolList = Array;

app.vm = (function() {
    var vm = {}
    vm.init = function() {
        vm.apiData = new app.apiData();
        vm.list = new app.SymbolList();
        //a slot to store the name of a new todo before it is created
        vm.symbol = m.prop("");
        //adds a todo to the list, and clears the description field for user convenience
        vm.add = function() {
            var data = vm.symbol();
            if (vm.symbol()) {
                data = {'text': data.toUpperCase()};
                m.request({method: 'POST',
                            url: '/api/stocks',
                            data: data,
                          }).then(function(list) {
                            vm.list = [];
                            for (var i =0; i< list.length ;i++) {
                              console.log(list[i].stock);
                              var stockSymbol = list[i].stock;
                              vm.list.push(new app.Stock({symbol : stockSymbol}));
                            }
                            return;
                          })
                vm.symbol("");
            }
        };
    }
    return vm
  }());
app.getData = function () {
  m.request({
    method: 'GET',
    url: '/api/stocks',
  }).then(function(data){
    app.vm.apiData = data;
  })
};

//app.parseData = function (data) {
  //for (var i =0; i< data.length ;i++) {
    //var stockSymbol = data[i].stock;
//    vm.list.push(new app.Stock({symbol : stockSymbol}));
//  }
//}

app.App = function(data){ // model class
  this.plotCfg = {
    chart: {
        renderTo: "plot"
    },
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
          data: app.vm.apiData
      }]
  };
};

//app.parseData(app.vm.apiData);

app.controller = function() { // controller
  this.apk = new app.App();
  this.cfg = this.apk.plotCfg;
  app.vm.init();
};
app.plotter = function(ctrl) { // config class
  return function(elem,isin) {
      if(!isin) {
        m.startComputation();
        var chart = Highcharts.StockChart(ctrl.cfg);
        m.endComputation();
      }
  };
};

app.Stock = function(data) {
  this.date_added = m.prop(new Date());
  this.symbol = m.prop(data.symbol);
  this.id = m.prop(data.id)
};

app.viewList = function() {
  return [
      m('input', { onchange: m.withAttr('value', app.vm.symbol),  value: app.vm.symbol()}),
      m('button.btn.btn-active.btn-primary', {onclick: app.vm.add}, 'Add Stock'),
      m('ul', [
        app.vm.list.map(function(item , index) {
          return m("li", [
            m('p', item.symbol())
          ])
        })
      ])
  ]
};

app.view = function(ctrl) { // view
  return m("#plot[style=height:400px]", {config: app.plotter(ctrl)}),
        m.component(app.viewList);
};

m.mount(document.getElementById('chart'), {controller: app.controller, view: app.view}); //mount chart
