var searchInputEl = document.querySelector("#search-input")
var formSubmitEl = document.querySelector('#search-form')
var cityResultsContainerEl = document.querySelector('#city-results')
var dataState = cityResultsContainerEl.getAttribute('data-list')
var cityName = ''

// Takes user search input and sends the input value to openweather API
var formSubmitHandler = function (event) {
    event.preventDefault();

    var searchInput = searchInputEl.value.trim();
    if (searchInput) {
        cityName = searchInput
        getCity(searchInput);
    }
}

// openweather API call takes user search query and returns a maximum of 5 choices to choose from. Results are listed as a button to choose from
var getCity = function (searchInput) {

    fetchURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + searchInput + '&limit=5&appid=982e602762d0f897c0cbabd69277fd71'

    fetch(fetchURL).then(function (response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function (PromiseResult) {
        localStorage.setItem(searchInput, JSON.stringify(PromiseResult));
        renderCity(PromiseResult)
    });
}

// takes returned object from API call and posts object to webpage
var renderCity = function(PromiseResult){
    if(dataState == 'false'){
        cityResultsContainerEl.setAttribute('data-list', 'true')
        dataState = 'true'
    }
    for(var i = 0; i < PromiseResult.length; i++){
        var searchCity = PromiseResult[i].name;
        var searchState = PromiseResult[i].state;
        var searchCountry = PromiseResult[i].country;
        var citylistEl = document.createElement('button');
        citylistEl.textContent = searchCity + ',' + searchState + ': ' + searchCountry
        citylistEl.setAttribute('refNum', i)
        cityResultsContainerEl.appendChild(citylistEl)

    };
}

// Takes the user chosen city and gets the latitude and longitude to pass to the getWeather function
var getCoords = function (event){
    if(dataState == 'true'){
        var pickCity = event.target.getAttribute('refNum');
        if (pickCity) {
            var pickCityRef = parseInt(pickCity)
            var cityResultObj = JSON.parse(localStorage.getItem(cityName))
            var latitude = cityResultObj[pickCityRef].lat
            var longitude = cityResultObj[pickCityRef].lon
            getForecast(latitude, longitude)
            getCurrentWeather(latitude, longitude)
        }
    }
}

// Take latitude and longitude to get precise weather info from chosen city for the current day
var getCurrentWeather = function (latitude, longitude){

    fetchURL = 'https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&appid=982e602762d0f897c0cbabd69277fd71&units=imperial'

    fetch(fetchURL).then(function (response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function (PromiseResult) {
        renderCurrentWeather(PromiseResult)
    })

}

// Take latitude and longitude to get precise weather info from chosen city for a 5 day forecast
var getForecast = function(latitude, longitude){

    fetchURL = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude + '&appid=982e602762d0f897c0cbabd69277fd71&units=imperial'

    fetch(fetchURL).then(function (response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function (PromiseResult) {
        renderForecast(PromiseResult.list)
    })
}

// Take current weather object and render results to the screen for current weather and then save the city and the current weather results into local storage. 
// Needs to include following information:
// 1. displays date (dt_txt)
// 2. icon representation of weather conditions (weather[0].description)
// 3. temperature (main.temp)
// 4. wind speed (wind.speed)
// 5. humidity (main.humidity)
var renderCurrentWeather = function(weatherObj){
    console.log(weatherObj)

}

// Take forecast object and render results to the screen for a 5 day forecast and then save the city and the 5 day result into local storage. 
// Needs to include following information:
// 1. displays date (dt_txt)
// 2. icon representation of weather conditions (weather[0].description)
// 3. temperature (main.temp)
// 4. wind speed (wind.speed)
// 5. humidity (main.humidity)
var renderForecast = function(forecastObj){
    console.log(forecastObj)
}

// find first 12:00:00 (n) then +8 from that index (n+8),  = 5 day forecast at 12:00pm each day
// 


cityResultsContainerEl.addEventListener('click', getCoords)
formSubmitEl.addEventListener('submit', formSubmitHandler);