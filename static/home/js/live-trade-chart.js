// util
Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Augt","Sepr","Oct","Nov","Dec"];

let chartHeight = 280
let backendData = []
let latestChartOptions;
let filteredData = [];

var nav_options = {
    series: [
        {
            name:"VIX",
            data:[]
        },
    ],
    chart: {
        id: "area-datetime",
        type: "area",
        height: chartHeight,
        toolbar: false,
        zoom: {
        autoScaleYaxis: true,
        },
        fontfamily:"'Poppins', sans-serif"
    },
    annotations: {
    },
    dataLabels: {
        enabled: false,
    },
        markers: {
        size: 0,
        style: "hollow",
    },
    xaxis: {
        // type: "datetime",
        categories: [],
        // min: new Date("01 Mar 2019").getTime(),
        axisTicks: {
            show: false,
            borderType: 'dotted',
            color: 'red',
            height: 6,
            offsetX: 0,
            offsetY: 0
        },
        labels: {
            show: true,
            rotate: 0,
            rotateAlways: false,
            hideOverlappingLabels: true,
            showDuplicates: false,
            trim: false,
            minHeight: undefined,
            maxHeight: 120,
            style: {
                colors: [],
                fontSize: '12px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 400,
                cssClass: 'apexcharts-xaxis-label',
            },
            offsetX: 10,
            offsetY: 0,
            format: undefined,
            formatter: undefined,
            datetimeUTC: false,
            datetimeFormatter: {
                year: 'yyyy',
                month: "MMM 'yy",
                day: 'dd MMM',
                hour: 'HH:mm',
            },
        },
        axisBorder:{
            show:false
        },
        tooltip:{
            enabled:false
        }
    },
    yaxis: {
        labels: {
            formatter: function (value) {
            return "$" + value.toFixed(2);
            },
        },
    },
    tooltip: {
        custom: function ( data ) {
            const { series, seriesIndex, dataPointIndex, w } = data
            const date =  filteredData.length
                                    ?
                                    new Date(filteredData[dataPointIndex][0]).toLocaleString('en-US', { timeZone: 'America/New_York' })
                                    :
                                    new Date(backendData[dataPointIndex][0]).toLocaleString('en-US', { timeZone: 'America/New_York' })
            const dateObj = new Date(date)
            const strLabel =`${dateObj.getDate()}, ${MONTHS[dateObj.getMonth()]}` 
            return (
            `<div class="custom-chart-tooltip">
                <h2 class="fw-normal">${series[seriesIndex][dataPointIndex]} - ${strLabel}</h2>
                <p class="text-blue">VIX <span class="text-lightgrey">&nbsp/&nbsp</span>${w.globals.seriesNames[0]==='VIXDown'? '<span class="text-red" id="cboe-text">CBOE Volatilatty Index</span>':'<span class="text-green" id="cboe-text">CBOE Volatilatty Index</span>'}</p>
            </div>`
            );
        },
    },
    grid: {
        show: true,
        borderColor: '#4d5c70ab',
        strokeDashArray: 0,
        position: 'back',
        xaxis: {
            lines: {
                show: true
            }
        },   
        yaxis: {
            lines: {
                show: true
            }
        },  
        row: {
            colors: undefined,
            opacity: 0.5
        },  
        column: {
            colors: undefined,
            opacity: 0.5
        },  
        padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },  
    },
    fill: {
        type: "gradient",
        gradient: {
            shade: 'dark',
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.4,
            stops: [0, 100],
            colorStops:[ 
            [
                // {
                // offset: 0,
                // color: '#35DF90',
                // opacity:0.25
                // },
                // {
                //     offset: 25,
                //     color: '#35DF90',
                //     opacity:0.2
                // },
                // {
                //     offset: 50,
                //     color: '#35DF90',
                //     opacity:0.15
                // },
                // {
                //     offset: 75,
                //     color: '#35DF90',
                //     opacity:0.12
                // },
                // {
                //     offset: 100,
                //     color: '#35DF90',
                //     opacity:0
                // }
            ]
            
            ]
        },
    },
    stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
        colors: [],
        width: 1.7,
        dashArray: 0,      
    }
};
  
  // AREA Chart
  var live_trade_chart = new ApexCharts(
    document.querySelector("#vix-stock-chart__live-trade"),
    nav_options
  );
  live_trade_chart.render();
  
// create an Observer instance
const resizeObserver = new ResizeObserver(entries => {
    chartHeight = entries[0].target.clientHeight > 900
                    ?
                    450
                    :
                    entries[0].target.clientHeight > 800
                    ?
                    380
                    :
                    280
    const chartOptions = latestChartOptions?latestChartOptions:nav_options
    let newChartData = {...chartOptions.chart, height: chartHeight}
    let newChartOption = {...chartOptions,series:[{name:"VIXDown", data:backendData.map(d=>d[1])}], chart:newChartData}
    live_trade_chart.updateOptions(newChartOption, true);
})
// start observing a DOM node
resizeObserver.observe(document.body)

  var resetCssClasses = function (activeEl) {
    var els = document.querySelectorAll("button");
    Array.prototype.forEach.call(els, function (el) {
      el.classList.remove("active");
    });
  
    activeEl.target.classList.add("active");
  };
  
//   get chart filter data
  const getFilteredData = (targetDate, oneDay)=>{
    const target_date = targetDate.toLocaleString('en-US', { timeZone: 'America/New_York' }) // time from where data should be displayed
    // console.log({target_date})
    const new_time_data = [];
    if(oneDay){
        for(let i = backendData.length-1; i>0; i--){
            const currChartDate = new Date(new Date(backendData[i][0]).toLocaleString('en-US', { timeZone: 'America/New_York' }))
            const currTargetDate = new Date(target_date)
            // console.log({back:currChartDate.getDate(), curr:currTargetDate.getDate()})
            if(currChartDate.getDate() >= currTargetDate.getDate()){
                // console.log({fff:backendData[i][0]})
                new_time_data.push(backendData[i][0])
            }
        }
    }else{
        for(let i = backendData.length-1; i>0; i--){
            const currChartDate = new Date(new Date(backendData[i][0]).toLocaleString('en-US', { timeZone: 'America/New_York' }))
            const currTargetDate = new Date(target_date)
            // console.log({back:currChartDate.getDate(), curr:currTargetDate.getDate()})
            if((currChartDate.getDate() >= currTargetDate.getDate()) && (currChartDate.getHours()>=currTargetDate.getHours())){
                new_time_data.push(backendData[i][0])
            }
        }
    }
    const startIndex = backendData.findIndex((dateVal)=>dateVal[0] === new_time_data[new_time_data.length-1])
    // console.log({startIndex:new_time_data[new_time_data.length-1]})
    const newData = backendData.slice(startIndex,backendData.length-1)
    return newData
  }

    // Chart filter
  const filterChartBtn = document.getElementsByClassName('filterChartBtn')
  const makeActiveBtn = (e)=>{
    for(let i=0;i<filterChartBtn.length;i++){
        filterChartBtn[i].classList.remove('active')
    }
    e && e.target.classList.add('active')
  }
  const filterVixChart = (e)=>{
        const {value} = e.target.dataset
       
        switch(value){
            case '1h':
                // console.log('1h')
                makeActiveBtn(e)
                let last_one_hour = new Date(backendData[backendData.length-1][0])
                last_one_hour.setHours(last_one_hour.getHours() - 1);
                const newDataOneHour = getFilteredData(last_one_hour)
                const newOneHoursOptions  = {...latestChartOptions, 
                    series:[{name: "VIX", data:newDataOneHour.map(d=>d[1])}], 
                    xaxis:{...latestChartOptions.xaxis, categories:newDataOneHour.map(d=>new Date(d[0]).toLocaleTimeString('en-US', { timeZone: 'America/New_York' }))},
                }
                live_trade_chart.updateOptions(newOneHoursOptions, true);
                filteredData=newDataOneHour
                return;
            case '3h':
                // console.log('3h')
                makeActiveBtn(e)
                let last_three_hour = new Date(backendData[backendData.length-1][0])
                last_three_hour.setHours(last_three_hour.getHours() - 3)
                const newDataThreeHour = getFilteredData(last_three_hour)

                const newThreeHoursOptions  = {...latestChartOptions, 
                    series:[{name: "VIX", data:newDataThreeHour.map(d=>d[1])}], 
                    xaxis:{...latestChartOptions.xaxis, categories:newDataThreeHour.map(d=>new Date(d[0]).toLocaleTimeString('en-US', { timeZone: 'America/New_York' }))},
                }
                live_trade_chart.updateOptions(newThreeHoursOptions, true);
                filteredData=newDataThreeHour

                return;
            case '8h':
                // console.log('8h')
                makeActiveBtn(e)
                let last_eight_hour = new Date(backendData[backendData.length-1][0])
                last_eight_hour.setHours(last_eight_hour.getHours() - 8);
                const newDataEightHour = getFilteredData(last_eight_hour)
                
                const newEightHoursOptions  = {...latestChartOptions, 
                    series:[{name: "VIX", data:newDataEightHour.map(d=>d[1])}], 
                    xaxis:{...latestChartOptions.xaxis, categories:newDataEightHour.map(d=>new Date(d[0]).toLocaleTimeString('en-US', { timeZone: 'America/New_York' }))},
                }
                live_trade_chart.updateOptions(newEightHoursOptions, true);
                filteredData=newDataEightHour
                return;
            case '1d':
                // console.log('1d')
                makeActiveBtn(e)
                let last_day = new Date(backendData[backendData.length-1][0])
                const lastDayData = getFilteredData(last_day, true)
                
                const newLastDayDataOptions  = {...latestChartOptions, 
                    series:[{name: "VIX", data:lastDayData.map(d=>d[1])}], 
                    xaxis:{...latestChartOptions.xaxis, categories:lastDayData.map(d=>new Date(d[0]).toLocaleTimeString('en-US', { timeZone: 'America/New_York' }))},
                }
                live_trade_chart.updateOptions(newLastDayDataOptions, true);
                filteredData=lastDayData

                return;
            case '2d':
                // console.log('2d')
                makeActiveBtn(e)
                e.target.classList.add('active')
                e.target.na
                const newTwoDayDataOptions  = {...latestChartOptions, 
                    series:[{name: "VIX", data:backendData.map(d=>d[1])}], 
                    xaxis:{...latestChartOptions.xaxis, categories:backendData.map(d=>new Date(d[0]).toLocaleTimeString('en-US', { timeZone: 'America/New_York' }))},
                }
                live_trade_chart.updateOptions(newTwoDayDataOptions, true);
                filteredData=[]
                return;
            default:
                console.log('default')

        }
  }