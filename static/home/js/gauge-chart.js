
// Calculation suff

const calculateFunc = async (reversion_probability,trading_days)=>{
  const calculate_now_audio = document.getElementById('calculate_now_audio')
  calculate_now_audio.play();
  const calculationContainer = document.getElementById('calculation-container')
  const calculationResultContainer = document.getElementById('calculation-result-container')
  const trading_days_val = document.getElementById('trading_days_val')
  document.getElementById('calculateBtn').innerHTML = `
                                                  CALCULATE NOW
                                                  <div class="spinner-border spinner-border-sm text-green" role="status">
                                                      <span class="sr-only"></span>
                                                  </div>`
      calculationContainer.classList.add('d-none')
      calculationResultContainer.classList.remove('d-none')
      trading_days_val.innerHTML = ""
      setTimeout(()=>{

        animateValue(trading_days_val, 0, trading_days, 1000);
      },1000)
      animateGauge(0)
      setTimeout(()=>{
        animateGauge(reversion_probability+3)
      }, 800)

      setTimeout(()=>{
        animateGaugeSlowFocus(reversion_probability-2, reversion_probability+3)

      }, 2000)
      setTimeout(()=>{
        animateGaugeSlowFocus(reversion_probability+1, reversion_probability-2)

      }, 2500)
      setTimeout(()=>{
        animateGaugeSlowFocus(reversion_probability, reversion_probability+1)

      }, 3000)
}



// Chart
var root = am5.Root.new("gauge-chart");
var myTheme = am5.Theme.new(root);

myTheme.rule("Label").setAll({
  fill: am5.color(0x495869),
  fontSize: "1em"
});

// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
  am5themes_Animated.new(root), 
  myTheme
]);

// Create chart
// https://www.amcharts.com/docs/v5/charts/radar-chart/
var chart = root.container.children.push(
  am5radar.RadarChart.new(root, {
    panX: false,
    panY: false,
    startAngle: 180,
    endAngle: 360,

  })
);

chart.getNumberFormatter().set("numberFormat", "#");

// Create axis and its renderer
// https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
var axisRenderer = am5radar.AxisRendererCircular.new(root, {
  innerRadius: -7,
});

axisRenderer.grid.template.setAll({
  stroke: root.interfaceColors.get("background"),
  visible: true,
  strokeOpacity: 0.8,

});

var xAxis = chart.xAxes.push(
  am5xy.ValueAxis.new(root, {
    maxDeviation: 0,
    min: 0,
    max: 100,
    strictMinMax: true,
    renderer: axisRenderer,
  })
);

// Add clock hand
// https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands
var axisDataItem = xAxis.makeDataItem({});

var clockHand = am5radar.ClockHand.new(root, {
  pinRadius: 30,
  radius: am5.percent(100),
  bottomWidth: 4,
  topWidth: 0.5,
});


clockHand.pin.setAll({
  fillOpacity: 0,
  strokeOpacity: 0,
  stroke: am5.color(0xffffff),
  strokeWidth: 0,
  strokeDasharray: [2, 2]
});
clockHand.hand.setAll({
  fillOpacity: 1,
  strokeOpacity: 0,
  stroke: am5.color(0xffffff),
  strokeWidth: 0,
  fill:"#2B64F8"
});

var bullet = axisDataItem.set(
  "bullet",
  am5xy.AxisBullet.new(root, {
    sprite: clockHand
  })
);

xAxis.createAxisRange(axisDataItem);

var label = chart.radarContainer.children.push(
  am5.Label.new(root, {
    centerX: am5.percent(50),
    textAlign: "center",
    centerY: am5.percent(50),
    fontSize: "1.5em",
    fill:"#35DF90"
  })
);

// set gauge final value
axisDataItem.set("value", 0);
bullet.get("sprite").on("rotation", function () {
  var value = axisDataItem.get("value");
  label.set("text", value.toFixed(2).toString() + "%");
});


chart.bulletsContainer.set("mask", undefined);

var colorSet = am5.ColorSet.new(root, {});

var axisRange0 = xAxis.createAxisRange(
  xAxis.makeDataItem({
    above: true,
    value: 0,
    endValue: 50
  })
);

axisRange0.get("axisFill").setAll({
  visible: true,
  fill:  "#D86464"
});

axisRange0.get("label").setAll({
  forceHidden: true,
});

var axisRange1 = xAxis.createAxisRange(
  xAxis.makeDataItem({
    above: true,
    value: 50,
    endValue: 100
  })
);

axisRange1.get("axisFill").setAll({
  visible: true,
  fill: "#35DF90"
});

axisRange1.get("label").setAll({
  forceHidden: true
});

// Make stuff animate on load
// chart.appear(1000, 100);

// Bottom label
// Add bottom label
// var label = chart.chartContainer.createChild(am5core.Label);
// label.text = "chance to rever within two weeks";
// label.align = "center";


// Create range

let axis = chart.xAxes.push(
    am5xy.ValueAxis.new(root, {
      maxDeviation: 0,
      min: 0,
      max: 100,
      strictMinMax: true,
      renderer: axisRenderer
    })
  );
function createRange(start, end, color, label, innerRadius) {
  
    var rangeDataItem = axis.makeDataItem({
      value: start,
      endValue: end
    });
  
    var range = axis.createAxisRange(rangeDataItem);
    
    rangeDataItem.get("axisFill").setAll({
      visible: true,
      fill: color,
      fillOpacity: 0.8,
      innerRadius: innerRadius
    });
    
    rangeDataItem.get("tick").setAll({
      visible: false
    });
  }
  

  createRange(75, 100, am5.color(0x35DF90), "Danger", -15);
  createRange(0, 25, am5.color(0xD86464), "Danger", -15);

  // animate




  
const animateGauge = (probability_value) => {
  axisDataItem.animate({
    key: "value",
    from: 0,
    to: probability_value,
    duration: 1500,
    easing: am5.ease.out(am5.ease.cubic)
  });
}
const animateGaugeSlowFocus = (probability_value, from) => {
  axisDataItem.animate({
    key: "value",
    from: from,
    to: probability_value,
    duration: 800,
    easing: am5.ease.out(am5.ease.cubic)
  });
}
// animateGauge()

// Calculate reversion probability
// const calculateBtn = document.getElementById('calculateBtn')

// calculateBtn.addEventListener('click', ()=>{
//   animateGauge()
// })
