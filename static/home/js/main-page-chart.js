// util
Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Augt","Sepr","Oct","Nov","Dec"];
let chartHeight = 280;
let backendData = []
let latestChartOptions;

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
        toolbar: {
            show:false
        },
        zoom: {
            enabled:false,
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
            const date =  new Date(backendData[dataPointIndex][0]).toLocaleString('en-US', { timeZone: 'America/New_York' })
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
    markers: {
        colors: [],
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

// NAV Chart
var main_page_chart = new ApexCharts(
  document.querySelector("#vix-stock-chart"),
  nav_options
);
main_page_chart.render();

// Fetch Data
const hikePercentageDivContent = document.getElementById('hike-percentage-div-content')
const summaryDiv =document.getElementById('summary-div')
const bullImg = document.getElementById('bullImg')
const bearImg = document.getElementById('bearImg')
const hikeText = document.getElementById('vix-hike-text')
const dropText = document.getElementById('vix-drop-text')
const loadingScreen = document.getElementById("loadingScreen")
const curent_vix_price_div = document.getElementById('current_vix_price')
const slot_machine_container = document.getElementById('slot-machine-container')
const slot_machine_container2 = document.getElementById('slot-machine-container2')

const hideLabels = async ()=>{
    const labelElements = document.getElementsByClassName("apexcharts-xaxis-label")

    const elemWithText =[]
    if(labelElements.length){
        for(let i=0; i<labelElements.length; i++){
            labelElements[i].classList.add('d-none')
            if(labelElements[i].textContent.length){
            elemWithText.push(labelElements[i])
        }
        }
        const midIndex = parseInt(elemWithText.length/2)
        const secondMid = parseInt(midIndex/2)
        elemWithText[0].classList.remove('d-none')
        elemWithText[elemWithText.length-2].classList.remove('d-none')
        elemWithText[midIndex+1].classList.remove('d-none')
        elemWithText[midIndex-2].classList.remove('d-none')
        elemWithText[secondMid-1].classList.remove('d-none')
        elemWithText[midIndex+secondMid].classList.remove('d-none')
        // elemWithText[elemWithText.length-1].classList.remove('d-none')
    }
}
// check if more than 6 x-axis labels are showing
const hideLabelsInterval = setTimeout(async()=>{
                                    console.log("ran.")
                                    await hideLabels()
                                },500)
setTimeout(()=>{
    const labelElements = document.getElementsByClassName("apexcharts-xaxis-label")
    if(labelElements.length<=6){
      clearInterval(hideLabelsInterval)
    }
},500)

const getData = async ()=>{
    console.log("fetching...")
    hikePercentageDivContent.innerHTML = ` <div class="text-green d-flex align-items-center justify-content-between large-percent-text mb-2 ml-5" id="vix-change-blur-text">
                                                <h2 class="fw-normal mb-0" id="vix_price_placeholder">
                                                +X.XX%
                                                </h2>
                                            </div>`

    loadingScreen.classList.remove('d-none')
    const vix_change_blur_text = document.getElementById('vix-change-blur-text')
    vix_change_blur_text && vix_change_blur_text.classList.add('blur-3')

            const res = await fetch("/get-main-page-chart-data")
       
            const resData = await res.json()
            const {chart_data, vix_change_percentage} = resData

            backendData = chart_data
            curent_vix_price_div.innerHTML = `Current VIX price : ${backendData[backendData.length -1][1]}`
            let newChartData = {...nav_options.chart, height: chartHeight}
            let newChartOption = {...nav_options, chart:newChartData}
            
            // new fill option 
            const newFillData = (Math.sign(vix_change_percentage) === -1) ? {...newChartOption.fill, gradient: {...newChartOption.fill.gradient, colorStops:[
                [
                    {
                    offset: 0,
                    color: '#e66464',
                    opacity:0.25
                    },
                    {
                        offset: 25,
                        color: '#e66464',
                        opacity:0.2
                    },
                    {
                        offset: 50,
                        color: '#e66464',
                        opacity:0.15
                    },
                    {
                        offset: 75,
                        color: '#e66464',
                        opacity:0.12
                    },
                    {
                        offset: 100,
                        color: '#e66464',
                        opacity:0
                    }
                ]
            ]}}:
            {...newChartOption.fill, gradient: {...newChartOption.fill.gradient, colorStops:[
                [
                    {
                    offset: 0,
                    color: '#35DF90',
                    opacity:0.25
                    },
                    {
                        offset: 25,
                        color: '#35DF90',
                        opacity:0.2
                    },
                    {
                        offset: 50,
                        color: '#35DF90',
                        opacity:0.15
                    },
                    {
                        offset: 75,
                        color: '#35DF90',
                        opacity:0.12
                    },
                    {
                        offset: 100,
                        color: '#35DF90',
                        opacity:0
                    }
                ]
            ]}}
            
            // update chart data
            const newOptions  = {...newChartOption, 
                                series:[{name:Math.sign(vix_change_percentage) === -1 ? "VIXDown" : "VIX", data:chart_data.map(d=>d[1])}], 
                                xaxis:{...newChartOption.xaxis, categories:chart_data.map(d=>new Date(d[0]).toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit' }))},
                                fill:{...newChartOption.fill, ...newFillData},
                                stroke: {...newChartOption.stroke, colors:Math.sign(vix_change_percentage) === -1? ['#e66464']:["#35DF90"]},
                                markers: {colors: Math.sign(vix_change_percentage) === -1?["#e66464"]:["#35DF90"]},
                            }
            main_page_chart.updateOptions(newOptions, true);
            latestChartOptions = newOptions

            // Bull/Bear Image
            
            const vix_price_placeholder = document.getElementById('vix_price_placeholder')
            const prev_vix_price = document.getElementById('prev_vix_price')
            // slot_machine_container.classList.remove('d-none')
            // slot_machine_container2.classList.remove('d-none')
            vix_change_blur_text && vix_change_blur_text.classList.remove('blur-3')
            if(vix_price_placeholder){ vix_price_placeholder.style.color="transparent"}
            if(prev_vix_price){prev_vix_price.style.color="transparent"}
           
            if(Math.sign(vix_change_percentage) === -1) {
                bearImg.classList.remove('d-none')
                bullImg.classList.add('d-none')
                hikeText.classList.add('d-none')
                dropText.classList.remove('d-none')
                summaryDiv.classList.add('vix-down')
                // const obj = document.getElementById("value");
               
                animateValue(vix_price_placeholder, vix_change_percentage+30, vix_change_percentage, 4000, "text-red");
                // slot_machine_container.innerHTML
                setTimeout(()=>{
                    // slot_machine_container.classList.add('d-none')
                    // slot_machine_container2.classList.add('d-none')
                    hikePercentageDivContent.innerHTML =`<div class="text-red d-flex align-items-center justify-content-between large-percent-text">
                                                            <h2 id="prev_vix_price">
                                                                ${vix_change_percentage}%
                                                            </h2>
                                                        </div>`
                },2000)
            }else {
                summaryDiv.classList.remove('vix-down')
                bearImg.classList.add('d-none')
                bullImg.classList.remove('d-none')
                hikeText.classList.remove('d-none')
                dropText.classList.add('d-none')
                // const obj = document.getElementById("value");
                animateValue(vix_price_placeholder, vix_change_percentage+30, vix_change_percentage, 4000, "text-green")

                setTimeout(()=>{
                    // slot_machine_container.classList.add('d-none')
                    // slot_machine_container2.classList.add('d-none')
                    hikePercentageDivContent.innerHTML =`<div class="text-green d-flex align-items-center justify-content-between large-percent-text">
                                                            <h2 id="prev_vix_price">
                                                                +${vix_change_percentage}%
                                                            </h2>
                                                        </div>`
                }, 2000)

            }
                        
            loadingScreen.classList.add('d-none')
    await hideLabels()
}



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
    main_page_chart.updateOptions(newChartOption, true);
    setTimeout(async()=>{
        await hideLabels()
    },500)
})
  // start observing a DOM node
  resizeObserver.observe(document.body)

  // backend call
    getData()
    setInterval(function(){ 
        // window.location.reload()
    getData()

    }, 80000);
 

var resetCssClasses = function (activeEl) {
  var els = document.querySelectorAll("button");
  Array.prototype.forEach.call(els, function (el) {
    el.classList.remove("active");
  });

  activeEl.target.classList.add("active");
};


