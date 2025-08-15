const two_days_vix_change = document.getElementsByClassName("live-price-container")
const detected_trades__top = document.getElementById("detected_trades__top")
const currentClosingPriceDataOne = document.getElementById("current-closing-price-data1")
const currentClosingPriceDataTwo = document.getElementById("current-closing-price-data2")
const todayLowPrice  = document.getElementById("today-low-price")
const todayHighPrice = document.getElementById("today-high-price")
const twoDayLowPrice = document.getElementById("two-day-low-price")
const twoDayHighPrice = document.getElementById("two-day-high-price")
const loadingScreen = document.getElementById("loadingScreen")
const last_updated_date = document.getElementById("last_updated_date")
// vix chilling
const vix_chilling_container = document.getElementById('vix-chilling-container')
const vix_not_chilling_container = document.getElementById('vix-not-chilling-container')
const expiry_date_btns = document.getElementById('expiry-dates-btns')
const expiry_date_btns_container =  document.getElementById('expiry-dates-btns_container')
const puts_and_buy_card_container = document.getElementById('puts-and-buy-card-container')

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

const getData = async ()=>{
    console.log("fetching...")
    loadingScreen.classList.remove('d-none')

    const response = await fetch("/get_live_trade_data")
            const data = await response.json()
            // console.log("got it!")
            detected_trades__top.classList.remove('blur-1')
            loadingScreen.classList.add('d-none')

            const {chart_data,current_closing_price,today_high_price,today_low_price,
                    two_day_high_price, two_day_low_price, vix_change_percentage, 
                    is_trade,
                    expiry_dates,
                    puts_to_buys,updated_date} = data 
            // console.log({data})
            if(is_trade){
                vix_chilling_container.classList.add('d-none')
                vix_not_chilling_container.classList.remove('d-none')
                // expiry date btns
                expiry_date_btns.innerHTML =  Object.keys(expiry_dates).map((key)=>{
                    if(expiry_dates[key]){
                        return `<small class="filter-small-text clickable active mx-1" data-value=${key}>${key}</small>`
                    }
                    return `<small class="filter-small-text mx-1" data-value=${key}>${key}</small>`
                }).join("")
                expiry_date_btns_container.classList.remove('blur-1')
                // puts and buy
                puts_and_buy_card_container.innerHTML = puts_to_buys.map(({strike_price, strike_date, price, break_even, prob_to_revert, max_profit, buy_at}, index)=>(
                    `
                    <div class="detected-trades__bottom__card mb-2 ${index>2?"hide-put-card":""}">
                        <div class="bottom__card__left d-flex justify-content-center text-start">
                            <div class="d-flex flex-column">
                                <small class="text-grey fw-500">STRIKE PRICE</small>
                                <span>
                                    $${strike_price} Put
                                        <img src="/static/home/icons/info-icon.svg" id="tooltip-img${index}" class="info-icon d-inline-block" tabindex="0" data-title="info"/>
                                </span>
                            </div>
                        </div>
                        <div class="bottom__card__right d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center card_section">
                                <div class="d-flex flex-column">
                                    <small class="text-grey">STRIKE DATE</small>
                                    <small class="fw-500">${strike_date}</small>
                                </div>
                                <div class="d-flex flex-column">
                                    <small class="text-grey">PRICE</small>
                                    <small class="fw-500">$${price}</small>
                                </div>
                                <div class="d-flex flex-column">
                                    <small class="text-grey">BREAK EVEN</small>
                                    <small class="fw-500">$${break_even}</small>
                                </div>
                            </div>
                            <div class="d-flex align-items-center card_section">
                                <div class="d-flex flex-column">
                                    <small class="text-grey">PROBABILITY TO REVERT</small>
                                    <small class="fw-500 text-green counter" data-value=${prob_to_revert}>${prob_to_revert}%</small>
                                </div>
                                <div class="d-flex flex-column">
                                    <small class="text-green">MAX PROFIT</small>
                                    <small class="fw-500 text-green counter" data-value=${max_profit}>${max_profit}%</small>
                                </div>
                                <div class="d-flex align-items-center buy-at-div">
                                    <small class="fw-600 text-blue">Buy at</small>
                                    <span class="fw-500">${buy_at}</span>
                                </div>
                            </div>
                        </div>
                    </div>`
                )).join("") 
                last_updated_date.classList.remove("blur-1")
                last_updated_date.innerHTML = updated_date
                const currentClosingPriceDivData = vix_change_percentage < 0
                                                    ?
                                                    `<span class="current-closing-price-data">
                                                        ${current_closing_price}
                                                    </span>
                                                    <small class="fw-600 text-red vix-change-data" style="margin-left: .2rem;">${vix_change_percentage}%</small>`
                                                    :
                                                    `<span class="current-closing-price-data">
                                                        ${current_closing_price}
                                                    </span>
                                                    <small class="fw-600 text-green vix-change-data" style="margin-left: .2rem;">+${vix_change_percentage}%</small>`
                currentClosingPriceDataOne.innerHTML = currentClosingPriceDivData
                currentClosingPriceDataTwo.innerHTML = currentClosingPriceDivData
                todayLowPrice.innerHTML=today_low_price
                todayHighPrice.innerHTML=today_high_price 
                twoDayLowPrice.innerHTML=two_day_low_price
                twoDayHighPrice.innerHTML=two_day_high_price
    
                // render chart
                backendData = chart_data
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
                                    xaxis:{...newChartOption.xaxis, categories:chart_data.map(d=>new Date(d[0]).toLocaleTimeString('en-US', { timeZone: 'America/New_York' }))},
                                    fill:{...newChartOption.fill, ...newFillData},
                                    stroke: {...newChartOption.stroke, colors:Math.sign(vix_change_percentage) === -1? ['#e66464']:["#35DF90"]},
                                    markers: {colors: Math.sign(vix_change_percentage) === -1?["#e66464"]:["#35DF90"]},
                                }
                live_trade_chart.updateOptions(newOptions, true);
                latestChartOptions = newOptions
                filteredData=[]
                makeActiveBtn()
                document.getElementById('two-day-data-filter-btn').classList.add('active')
                const counters = document.getElementsByClassName('counter')
                setTimeout(()=>{
                    for(let i=0; i<counters.length; i++){
                        const val = parseFloat(counters[i].dataset.value)
                        animateValue(counters[i], 0, val, 1000)
                    }
                }, 500)
            }else{
                vix_chilling_container.classList.remove('d-none')
                vix_not_chilling_container.classList.add('d-none')
            }
    await hideLabels()
    }
// backend call
getData()
    setInterval(function(){ 
        getData()
    }, 80000);
