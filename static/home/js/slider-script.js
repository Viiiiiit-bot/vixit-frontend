window.onload = function(){
    slideOne();
    slideTwo();
}

let start_value_of_left_slider = 15
let end_value_of_left_slider = 20
let start_value_of_right_slider = 15
let end_value_of_right_slider = 25
const value_to_inc_dec = 5 // value by which start and end value of slider will be increased/decreased

let selectedStart = false;
let selectedEnd = false;

let sliderOne = document.getElementById("slider-1");
let sliderTwo = document.getElementById("slider-2");
let displayValOne = document.getElementById("range1");
let displayValTwo = document.getElementById("range2");
let minGap = 1;
let sliderTrack = document.querySelector(".slider-track");
let sliderMaxValue = document.getElementById("slider-1").max;

// Select end and start price
const handleSliderChange = async (e)=>{
    const resultContainer = document.getElementById('result-container')
    const calculationResultContainer = document.getElementById('calculation-result-container')
    const claculateBtnContainer = document.getElementById('calculation-container')
    claculateBtnContainer.classList.add('d-none')
    const {value, id} = e.target
    if(id === 'slider-1'){
        selectedStart = true;
        // console.log({value})
        if(parseInt(value) === end_value_of_left_slider){

            
            if(end_value_of_left_slider >=100 || end_value_of_right_slider >=100){
                start_value_of_left_slider = 80
                end_value_of_left_slider = 99
                // sliderOne.setAttribute("min", 80)
                sliderOne.setAttribute("max", 99)

                start_value_of_right_slider=80
                end_value_of_right_slider=100
                // sliderTwo.setAttribute("min", 80)
                sliderTwo.setAttribute("max", 100)
                // sliderTwo.value=100
                displayValTwo.textContent = 100;

                return;
            }else{
                start_value_of_left_slider = start_value_of_left_slider+value_to_inc_dec
                end_value_of_left_slider = end_value_of_left_slider+value_to_inc_dec

                start_value_of_right_slider = start_value_of_right_slider+value_to_inc_dec
                end_value_of_right_slider = end_value_of_right_slider+value_to_inc_dec

                // sliderOne.setAttribute("min", start_value_of_left_slider)
                sliderOne.setAttribute("max", end_value_of_left_slider)

                // sliderTwo.setAttribute("min", start_value_of_right_slider)
                sliderTwo.setAttribute("max", end_value_of_right_slider)
                // console.log({end_value_of_right_slider})
                sliderTwo.value=end_value_of_right_slider-2
                displayValTwo.textContent = end_value_of_right_slider-2;
                // console.log({end_value_of_right_slider, val:sliderTwo.value})


            }
        }else if(parseInt(value) === start_value_of_left_slider){
        
            if(end_value_of_left_slider <=20){
                start_value_of_left_slider = 0
                end_value_of_left_slider = 20
                // sliderOne.setAttribute("min", 0)
                sliderOne.setAttribute("max", 20)
                
                start_value_of_right_slider=0
                end_value_of_right_slider=25
                // sliderTwo.setAttribute("min", 0)
                sliderTwo.setAttribute("max", 25)
                // sliderTwo.value=24
                displayValTwo.textContent = 25;
                return;
            }else{
                start_value_of_left_slider = start_value_of_left_slider-value_to_inc_dec
                end_value_of_left_slider = end_value_of_left_slider-value_to_inc_dec

                start_value_of_right_slider = start_value_of_right_slider-value_to_inc_dec
                end_value_of_right_slider = end_value_of_right_slider-value_to_inc_dec
                // sliderOne.setAttribute("min", start_value_of_left_slider)
                sliderOne.setAttribute("max", end_value_of_left_slider)

                // sliderTwo.setAttribute("min", start_value_of_right_slider)
                sliderTwo.setAttribute("max", end_value_of_right_slider)
                sliderTwo.value=end_value_of_right_slider-2
                displayValTwo.textContent = end_value_of_right_slider-2;
            }
        }
    }else if(id === 'slider-2'){
        // console.log("slider 2 = ", value)

        selectedEnd = true;
        if(end_value_of_left_slider >=100 || end_value_of_right_slider >=100){
            start_value_of_left_slider = 80
            end_value_of_left_slider = 99
            // sliderOne.setAttribute("min", 80)
            sliderOne.setAttribute("max", 99)

            start_value_of_right_slider=80
            end_value_of_right_slider=100
            // sliderTwo.setAttribute("min", 80)
            sliderTwo.setAttribute("max", 100)
            // sliderTwo.value=100
            displayValTwo.textContent = 100;

            return;
        }else if(parseInt(value) === end_value_of_right_slider){
            start_value_of_left_slider = start_value_of_left_slider+value_to_inc_dec
            end_value_of_left_slider = end_value_of_left_slider+value_to_inc_dec

            start_value_of_right_slider = start_value_of_right_slider+value_to_inc_dec
            end_value_of_right_slider = end_value_of_right_slider+value_to_inc_dec

            // sliderOne.setAttribute("min", start_value_of_left_slider)
            sliderOne.setAttribute("max", end_value_of_left_slider)

            // sliderTwo.setAttribute("min", start_value_of_right_slider)
            sliderTwo.setAttribute("max", end_value_of_right_slider)
            sliderTwo.value=end_value_of_right_slider-2
            displayValTwo.textContent = end_value_of_right_slider-2;
        }
    }
    // console.log({selectedEnd, selectedStart})
    if(selectedStart && selectedEnd){
        const formData = new FormData()
        formData.append('start_value', parseInt(sliderOne.value))
        formData.append('end_value', parseInt(sliderTwo.value))

        fetch("/simulate-hike/", {
            method:"POST",
            headers:{
                'X-CSRFToken': csrftoken
            },
            body: formData
        })
        .then((res)=>res.json())
        .then(({simulate_data, choosen_hike, trading_days, reversion_probability})=>{
            const newChartOptions = getEmptyChartOptions(true)
            window.sessionStorage.setItem('drawChart', true)
            // update chartData variable of empty-chart.js
            chartData = simulate_data.map((data, index)=>[index, data])
            isDrawTrue = true;
            let newChartData = {...newChartOptions, series:[{name:"SIMULATE HIKE", data:chartData}] }
            // let newChartOption = {...newChartOptions, chart:newChartData}
            empty_chart.updateOptions(newChartData, true)
            // empty_chart.updateSeries([{data:simulate_data.map((data, index)=>[index, data])}])

            // Choosen hike
            resultContainer.innerHTML = `<small class="fw-600 text-lightgrey">Results:</small>
                                            <small class="fw-600 text-green" style="margin-left: 0.5rem">You choose a ${choosen_hike}% hike</small>`
            if(reversion_probability === 0){
                claculateBtnContainer.classList.remove('d-none')
                claculateBtnContainer.innerHTML = `<h6 style="font-size:0.8rem">Hike of ${choosen_hike}% never happened in history!</h6>`
            }else{

                claculateBtnContainer.classList.remove('d-none')
                claculateBtnContainer.innerHTML = ` <a href="#" class="btn button-green" onclick="calculateFunc(${reversion_probability}, ${trading_days})" id="calculateBtn">
                                                    CALCULATE NOW
                                                        <i class="fa fa-caret-right" aria-hidden="true"></i>
                                                    </a>`
            }
        })
        calculationResultContainer.classList.add('d-none')
        resultContainer.classList.remove('d-none')
        
        resultContainer.innerHTML = `<div class="spinner-border spinner-border-sm text-grey" role="status">
                                            <span class="sr-only"></span>
                                        </div>`

    }else{
        resultContainer.classList.add('d-none')
        claculateBtnContainer.classList.add('d-none')
    }
}


// Slide events
function slideOne(){
    if(parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap){
        sliderOne.value = parseInt(sliderTwo.value) - minGap;
    }
    displayValOne.textContent = sliderOne.value;
    fillColor();
}
function slideTwo(){
    if(parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap){
        sliderTwo.value = parseInt(sliderOne.value) + minGap;
    }
    displayValTwo.textContent = sliderTwo.value;
    fillColor();
}
function fillColor(){
    percent1 = (sliderOne.value / sliderMaxValue) * 100;
    percent2 = (sliderTwo.value / sliderMaxValue) * 100;
    // sliderTrack.style.background = `linear-gradient(to right,  #2e3946 ${percent1}% , #3264fea6 ${percent1}% , #3264fea6 ${percent2}%,  #2e3946 ${percent2}%)`;
}
// `linear-gradient(to right,  #2e3946 ${percent1}%, #3264fe  ${percent1}%, #3264fe ${percent2}, #2e3946 ${percent2}) `
// linear-gradient(to right, #2e3946 30%, #3264fe 30%, #3264fe 70%, #2e3946 70%) !important