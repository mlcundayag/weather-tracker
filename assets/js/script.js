var citySearchForm = $('#weather-form')
var citySearchEl = $('#city-search')
var cityPrintEl = $('#city-print')
var weatherDisplayEl = $('#weather-display')
var getWeatherEl = $('#get-weather')
var currentCityEl = $('#current-city')
var temperatureEl = $('#temperature')
var humidityEl = $('#humidity')
var windSpeedEl = $('#wind-speed')
var uvIndexEl = $('#uv-index')

var cities = []
var inputCity = ""



function searchCity(event) {
    event.preventDefault();
    if (citySearchEl.val().trim() !== "") {
        inputCity = citySearchEl.val().trim();
        weatherForecast(inputCity)
    }
}

function weatherForecast(inputCity) {
    var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + inputCity + '&appid=56ba39e8ad5c62fe3744a7e89048f354';
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            console.log(data.wind.speed);
            console.log(data.main.temp);
            console.log(data.main.humidity);
            console.log(data.coord.lat);
            console.log(data.coord.lon);
            var currentTemp = Number((data.main.temp - 273.15) * 1.80 + 32).toFixed(2)
            $(temperatureEl).text(currentTemp + ' °F')
        })
}



function searchButton(event) {
    event.preventDefault();
    var inputCity = $('input[name="city-search"]').val();
    if (!inputCity) {
        return;
    }
    cityPrintEl.append('<li class="py-2 my-3 bg-secondary text-white city-list">' + inputCity + '</li>');
    $('input[name="city-search"]').val('');
    $(currentCityEl).text(inputCity)
}


$("#get-weather").on("click",searchCity);
$("#get-weather").on("click",searchButton);