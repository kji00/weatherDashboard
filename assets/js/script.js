var searchInputEl = document.querySelector("#search-input");
var formSubmitEl = document.querySelector('#search-form');
var cityResultsContainerEl = document.querySelector('#city-results');
var currentWeatherEl = document.querySelector('#current-weather');
var fiveDayEl = document.querySelector('#five-day-container');
var dataState = cityResultsContainerEl.getAttribute('data-list');
var cityName = '';


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
var renderCity = function (PromiseResult) {
    if (dataState == 'false') {
        cityResultsContainerEl.setAttribute('data-list', 'true')
        dataState = 'true'
    }
    for (var i = 0; i < PromiseResult.length; i++) {
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
var getCoords = function (event) {
    if (dataState == 'true') {
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
var getCurrentWeather = function (latitude, longitude) {

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
var getForecast = function (latitude, longitude) {

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

// Take current weather object and render results to the screen for current weather conditions in chosen city. 
// Needs to include following information:
// 1. displays date (dt - is shown in seconds, convert with dayjs)
// 2. icon representation of weather conditions (weather[0].icon)
// 3. temperature (main.temp)
// 4. wind speed (wind.speed)
// 5. humidity (main.humidity)
var renderCurrentWeather = function (weatherObj) {
    var currentDate = dayjs(weatherObj.dt * 1000).format('M/DD/YYYY')
    var getIcon = 'https://openweathermap.org/img/w/' + weatherObj.weather[0].icon + '.png'
    var currentTemp = weatherObj.main.temp
    var currentWindSpeed = weatherObj.wind.speed
    var currentHumidity = weatherObj.main.humidity

    // Create h1 tag with current date
    var currentDateEl = document.createElement('h1');
    var dateNode = document.createTextNode(currentDate);
    currentDateEl.appendChild(dateNode);
    currentWeatherEl.appendChild(currentDateEl);

    //create weather icon that reflects current weather status
    var getIconEl = document.createElement('img')
    getIconEl.setAttribute('src', getIcon)
    currentWeatherEl.appendChild(getIconEl);


    // Create p tag with current temperature
    var currentTempEl = document.createElement('p');
    var tempNode = document.createTextNode('Temp: ' + currentTemp + ' °F');
    currentTempEl.appendChild(tempNode);
    currentWeatherEl.appendChild(currentTempEl);

    // Create p tag with current wind
    var currentWindSpeedEl = document.createElement('p');
    var windNode = document.createTextNode('Wind: ' + currentWindSpeed + ' MPH');
    currentWindSpeedEl.appendChild(windNode);
    currentWeatherEl.appendChild(currentWindSpeedEl);

    // Create p tag with current humidity
    var currentHumidityEl = document.createElement('p');
    var humidityNode = document.createTextNode('Humidity: ' + currentHumidity + ' %');
    currentHumidityEl.appendChild(humidityNode);
    currentWeatherEl.appendChild(currentHumidityEl);

}

// Take forecast object and render results to the screen for a 5 day forecast and then save the city and the 5 day result into local storage. 
// Needs to include following information:
// 1. displays date (dt_txt - is shown in seconds, convert with dayjs)
// 2. icon representation of weather conditions (weather[0].icon)
// 3. temperature (main.temp)
// 4. wind speed (wind.speed)
// 5. humidity (main.humidity)
var renderForecast = function (forecastObj) {
    var i = 0;
    var ref = 0;
    console.log(forecastObj)
    console.log(dayjs(forecastObj[0].dt * 1000).format('M/DD/YYYY'))
    while (i < 5){
        var forecastDate = dayjs(forecastObj[ref].dt * 1000).format('M/DD/YYYY')
        var forecastIcon = 'https://openweathermap.org/img/w/' + forecastObj[ref].weather[0].icon + '.png'
        var forecastTemp = forecastObj[ref].main.temp
        var forecastWind = forecastObj[ref].wind.speed
        var forecastHumidity = forecastObj[ref].main.humidity
        
        // create div for each day of the forecast
        var newDiv = document.createElement('div')
        newDiv.setAttribute('class', 'box')
        fiveDayEl.appendChild(newDiv)

        // Create h1 tag with forecast date
        var newDivEl = document.querySelector('.box')
        var forecastDateEl = document.createElement('h1');
        var forecastDateNode = document.createTextNode(forecastDate);
        forecastDateEl.appendChild(forecastDateNode);
        newDivEl.appendChild(forecastDateEl);

        //create weather icon that reflects forecast weather status
        var forecastIconEl = document.createElement('img')
        forecastIconEl.setAttribute('src', forecastIcon)
        newDivEl.appendChild(forecastIconEl);

        // Create p tag with forecast temperature
        var forecastTempEl = document.createElement('p');
        var forecastTempNode = document.createTextNode('Temp: ' + forecastTemp + ' °F');
        forecastTempEl.appendChild(forecastTempNode);
        newDivEl.appendChild(forecastTempEl);

        // Create p tag with forecast wind
        var forecastWindSpeedEl = document.createElement('p');
        var forecastWindNode = document.createTextNode('Wind: ' + forecastWind + ' MPH');
        forecastWindSpeedEl.appendChild(forecastWindNode);
        newDivEl.appendChild(forecastWindSpeedEl);

        // Create p tag with forecast humidity
        var forecastHumidityEl = document.createElement('p');
        var forecastHumidityNode = document.createTextNode('Humidity: ' + forecastHumidity + ' %');
        forecastHumidityEl.appendChild(forecastHumidityNode);
        newDivEl.appendChild(forecastHumidityEl);

        ref += 8;
        i++;

        console.log(ref)
        console.log(i)
    }
}

// find first 12:00:00 (n) then +8 from that index (n+8),  = 5 day forecast at 12:00pm each day
// 


cityResultsContainerEl.addEventListener('click', getCoords)
formSubmitEl.addEventListener('submit', formSubmitHandler);