$(function () {
    var seriesOptions = [],
        seriesCounter = 0;
    /**
     * Create the chart when all data is loaded
     * @returns {undefined}
     */
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
    });
    app.App = function(data){ // model class
    this.plotCfg = {
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
            data: chartData
        }]
    };
};
app.controller = function() { // controller
    this.apk = new app.App();
    this.cfg = this.apk.plotCfg;
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
app.view = function(ctrl) { // view
    return  m("html", [ m("body", [
        m("#plot[style=height:400px]", {config: app.plotter(ctrl)}),
        //when I set breakpoint here I can see plot for a moment. It disappears when I resume normal script flow
        m("p", "some text after plot"),
        ]),
    ])
};
m.module(document, app);
