var citySearchForm = $('#weather-form')
var citySearchEl = $('#city-search')
var cityPrintEl = $('#city-print')
var weatherDisplayEl = $('#weather-display')
var getWeatherEl = $('#get-weather')

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
        })
}



function searchButton(event) {
    event.preventDefault();
    var inputCity = $('input[name="city-search"]').val();
    if (!inputCity) {
        return;
    }
    cityPrintEl.append('<li class="p-2 city-list">' + inputCity + '</li>');
    $('input[name="city-search"]').val('');
}


$("#get-weather").on("click",searchCity);