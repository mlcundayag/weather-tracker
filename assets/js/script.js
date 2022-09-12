var citySearchForm = $('#weather-form') //form
var citySearchEl = $('#city-search') //input
var cityPrintEl = $('#city-print') //ul

var weatherDisplayEl = $('#weather-display') //div container
var currentCityEl = $('#current-city') //city text
var temperatureEl = $('#temperature') //temp
var humidityEl = $('#humidity') //humidity
var windSpeedEl = $('#wind-speed') //wind-speed
var uvIndexEl = $('#uv-index') //uv

var searchedCity = [] //make an array of set objects
var city = "" //variable to store searched city

window.setInterval(function() {
    $('#current-day').text(moment().format('dddd, MMMM Do YYYY, h:mm:ss a'))
}, 1000);

//Checked if city is already in the storage
function find(c) {
    for (var i = 0; i < searchedCity.length; i++) {
        if (c.toUpperCase() === searchedCity[i]) {
            return -1;
        }
    }
    return 1;
}


function searchCity(event) {
    event.preventDefault
    if (citySearchEl.val().trim() !== "") {
        city = citySearchEl.val().trim();
        weatherForecast(city)
    }
}


function weatherForecast(city) {
    var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=56ba39e8ad5c62fe3744a7e89048f354';
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var weatherIcon = data.weather[0].icon;
            var iconUrl = "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";

            var date = new Date(data.dt * 1000).toLocaleDateString();

            $(currentCityEl).html(data.name + "  (" + date + ")" + "<img src=" + iconUrl + ">");

            var currentTemp = Number((data.main.temp - 273.15) * 1.80 + 32).toFixed(2)
            $(temperatureEl).text(currentTemp + ' °F')

            var currentWindSpeed = Number(data.wind.speed * 2.237).toFixed(1)
            $(windSpeedEl).text(currentWindSpeed + 'MPH')

            $(humidityEl).text(data.main.humidity + '%')

            getUV(data.coord.lat, data.coord.lon);
            forecast(data.id);
            if (data.cod == 200) {
                searchedCity = JSON.parse(localStorage.getItem("cityName"));
                if (searchedCity == null) {
                    searchedCity = [];
                    searchedCity.push(city.toUpperCase());
                    localStorage.setItem("cityName", JSON.stringify(searchedCity));
                    renderList(city);
                }
                else {
                    if (find(city) > 0) {
                        searchedCity.push(city.toUpperCase());
                        localStorage.setItem("cityName", JSON.stringify(searchedCity));
                        renderList(city)
                    }
                }
            }
        });
}

function getUV(lat, lon) {
    var UVIndexUrl = 'https://api.openweathermap.org/data/2.5/uvi?appid=56ba39e8ad5c62fe3744a7e89048f354&lat=' + lat + '&lon=' + lon;
    fetch(UVIndexUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data.value);
            $(uvIndexEl).text(data.value)
            if (data.value > 0 && data.value < 3){
                uvIndexEl.attr("style", "background-color: green");
            } else if (data.value >= 3 && data.value < 5) {
                uvIndexEl.attr("style", "background-color: yellow")
            } else if (data.value >= 5 && data.value < 7 ) {
                uvIndexEl.attr("style", "background-color: orange");
            } else if (data.value >= 7 && data.value < 11) {
                uvIndexEl.attr("style", "background-color: red");
            } else if (data.value >= 11) {
                uvIndexEl.attr("style", "background-color: purple");
            }
        })
}

function forecast(cityID) {
    var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=56ba39e8ad5c62fe3744a7e89048f354";
    fetch(forecastUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            for (i = 0; i < 5; i++) {
                var date = new Date((data.list[((i + 1) * 8) - 1].dt) * 1000).toLocaleDateString();
                var iconCode = data.list[((i + 1) * 8) - 1].weather[0].icon
                var iconUrl = "https://openweathermap.org/img/wn/" + iconCode + ".png";
                var tempRaw = data.list[((i + 1) * 8) - 1].main.temp
                var temp = (((tempRaw - 273.5) * 1.80) + 32).toFixed(2);
                var humidity = data.list[((i + 1) * 8) - 1].main.humidity
                var windRaw = data.list[((i + 1) * 8) - 1].wind.speed
                var wind = (windRaw * 2.237).toFixed(1);

                $("#date-" + i).html(date);
                $("#icon-" + i).html("<img src=" + iconUrl + ">");
                $("#temp-" + i).html(temp + " &#8457");
                $("#wind-" + i).html(wind + "MPH")
                $("#humidity-" + i).html(humidity + "%");
            }
        });
}

function renderList(c) {
    var listEl = $("<li>" + c.toUpperCase() + "</li>");
    $(listEl).attr("class", "py-2 my-3 bg-secondary text-white city-list");
    $(listEl).attr("data-value", c.toUpperCase());
    $(cityPrintEl).append(listEl);
}

function renderPastSearch(event) {
    var liEl = event.target;
    if (event.target.matches("li")) {
        city = liEl.textContent.trim();
        weatherForecast(city);
    }
}

function showCity() {
    $("ul").empty();
    var searchedCity = JSON.parse(localStorage.getItem("cityName"));
    if (searchedCity !== null) {
        searchedCity = JSON.parse(localStorage.getItem("cityName"));
        for (i = 0; i < searchedCity.length; i++) {
            renderList(searchedCity[i]);
        }
        city = searchedCity[i - 1];
        weatherForecast(city)
    }
}

function reset(event) {
    event.preventDefault();
    searchedCity = [];
    localStorage.removeItem("cityName");
    document.location.reload();
}


function searchButton(event) {
    event.preventDefault();
    var inputCity = $('input[name="city-search"]').val();
    if (!inputCity) {
        return;
    }
    $('input[name="city-search"]').val('');
    $(currentCityEl).text(inputCity)
}


$("#get-weather").on("click",searchCity);
$("#get-weather").on("click",searchButton);
$(document).on("click", renderPastSearch)
$(window).on("load", showCity)
$("#clear-history").on("click", reset)

