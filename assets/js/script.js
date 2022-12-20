var searchInputEl = document.querySelector("#search-input");
var formSubmitEl = document.querySelector('#search-form');
var cityResultsContainerEl = document.querySelector('#city-results');
var allWeatherEl = document.querySelector('#all-weather-container');
var currentWeatherEl = document.querySelector('#current-weather');
var fiveDayEl = document.querySelector('#five-day-container');
var savedCityEl = document.querySelector('#saved-city');
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
        citylistEl.textContent = searchCity + ', ' + searchState + ': ' + searchCountry
        citylistEl.setAttribute('refNum', i)
        citylistEl.setAttribute('class', "btn btn-info btn-block d-block")
        cityResultsContainerEl.appendChild(citylistEl)

    };

}

// Takes the user chosen city and gets the latitude and longitude to pass to the getWeather function
var getCoords = function (event) {

    cityResultsContainerEl.innerHTML = '';

    if (dataState == 'true') {
        var pickCity = event.target.getAttribute('refNum');
        if (pickCity) {
            var pickCityRef = parseInt(pickCity)
            var cityResultObj = JSON.parse(localStorage.getItem(cityName))
            var latitude = cityResultObj[pickCityRef].lat
            var longitude = cityResultObj[pickCityRef].lon
            var coordObj = {
                citylat: latitude,
                citylon: longitude
            }
            localStorage.setItem(cityName + 'Coords', JSON.stringify(coordObj))
            allWeatherEl.style.display = "block";
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
            var forecastObj = PromiseResult.list
            renderForecast(forecastObj)
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

    currentWeatherEl.innerHTML = '';

    var currentDate = dayjs(weatherObj.dt * 1000).format('M/DD/YYYY')
    var getIcon = 'https://openweathermap.org/img/w/' + weatherObj.weather[0].icon + '.png'
    var currentTemp = weatherObj.main.temp
    var currentWindSpeed = weatherObj.wind.speed
    var currentHumidity = weatherObj.main.humidity

    // Create h1 tag with current date
    var currentDateEl = document.createElement('h1');
    var dateNode = document.createTextNode(cityName + ' ' + currentDate);
    currentDateEl.appendChild(dateNode);
    currentWeatherEl.appendChild(currentDateEl);

    // Create weather icon that reflects current weather status
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

    var ref = 0;
    var now = parseInt(dayjs().format('D'))
    var savedForecast = []

    // finds first iteration where it is the next day
    for (var x = 0; x < forecastObj.length; x++) {
        var getDay = parseInt(dayjs(forecastObj[x].dt * 1000).format('D'))
        if (now < getDay) {
            ref = x;
            break
        }
    }

    fiveDayEl.innerHTML = '';

    for (var i = 0; i < 5; i++) {
        var forecastDate = dayjs(forecastObj[ref].dt * 1000).format('M/DD/YYYY')
        var forecastIcon = 'https://openweathermap.org/img/w/' + forecastObj[ref].weather[0].icon + '.png'
        var forecastTemp = forecastObj[ref].main.temp
        var forecastWind = forecastObj[ref].wind.speed
        var forecastHumidity = forecastObj[ref].main.humidity
        var newObj = {
            date: forecastDate,
            icon: forecastIcon,
            temp: forecastTemp,
            wind: forecastWind,
            humidity: forecastHumidity
        }

        // Create div with day+i id and class of box
        var newDay = document.createElement('div')
        newDay.id = 'day' + i;
        newDay.className = 'box';
        fiveDayEl.appendChild(newDay);


        // Create h1 tag with forecast date
        var newTagEl = document.getElementById('day' + i);
        var forecastDateEl = document.createElement('h3');
        var forecastDateNode = document.createTextNode(forecastDate);
        forecastDateEl.appendChild(forecastDateNode);
        newTagEl.appendChild(forecastDateEl);

        // Create weather icon that reflects forecast weather status
        var forecastIconEl = document.createElement('img')
        forecastIconEl.setAttribute('src', forecastIcon)
        newTagEl.appendChild(forecastIconEl);

        // Create p tag with forecast temperature
        var forecastTempEl = document.createElement('p');
        var forecastTempNode = document.createTextNode('Temp: ' + forecastTemp + ' °F');
        forecastTempEl.appendChild(forecastTempNode);
        newTagEl.appendChild(forecastTempEl);

        // Create p tag with forecast wind
        var forecastWindSpeedEl = document.createElement('p');
        var forecastWindNode = document.createTextNode('Wind: ' + forecastWind + ' MPH');
        forecastWindSpeedEl.appendChild(forecastWindNode);
        newTagEl.appendChild(forecastWindSpeedEl);

        // Create p tag with forecast humidity
        var forecastHumidityEl = document.createElement('p');
        var forecastHumidityNode = document.createTextNode('Humidity: ' + forecastHumidity + ' %');
        forecastHumidityEl.appendChild(forecastHumidityNode);
        newTagEl.appendChild(forecastHumidityEl);

        // find first next day then +8 from that index (n+8) to get the following day after that, = 5 day forecast 
        ref += 8;

        savedForecast.push(newObj)
    }

    localStorage.setItem(cityName + 'Key', JSON.stringify(savedForecast));
    renderCityHistory(cityName)
}

var renderCityHistory = function (cityName) {
    var savedCitiesEl = document.querySelector('#saved-cities')
    var cityHistory = document.createElement('button');
    cityHistory.setAttribute('class', "btn btn-info btn-block d-block")
    cityHistory.id = cityName + 'Key';
    cityHistory.name = cityName;
    cityHistory.textContent = cityName
    savedCitiesEl.appendChild(cityHistory)

}

// redisplay current weather for previously selected cities
var displayHistory = function (event) {
    var redisplayCity = event.target.getAttribute('name');
    var previousCity = JSON.parse(localStorage.getItem(redisplayCity + 'Coords'));
    cityName = redisplayCity;
    getCurrentWeather(previousCity.citylat, previousCity.citylon);
    displayForecastHistory(redisplayCity)
}

var displayForecastHistory = function(cityForecast){
    var cityKeyObj = JSON.parse(localStorage.getItem(cityForecast+'Key'))
    console.log(cityKeyObj)

    fiveDayEl.innerHTML = '';

    for (var i = 0; i < 5; i++) {
        var previousDate = cityKeyObj[i].date
        var previousIcon = cityKeyObj[i].icon
        var previousTemp = cityKeyObj[i].temp
        var previousWind = cityKeyObj[i].wind
        var previousHumidity = cityKeyObj[i].humidity

        // Create div with day+i id and class of box
        var newDay = document.createElement('div')
        newDay.id = 'day' + i;
        newDay.className = 'box';
        fiveDayEl.appendChild(newDay);


        // Create h1 tag with previous date
        var newTagEl = document.getElementById('day' + i);
        var previousDateEl = document.createElement('h3');
        var previousDateNode = document.createTextNode(previousDate);
        previousDateEl.appendChild(previousDateNode);
        newTagEl.appendChild(previousDateEl);

        // Create weather icon that reflects previous weather status
        var previousIconEl = document.createElement('img')
        previousIconEl.setAttribute('src', previousIcon)
        newTagEl.appendChild(previousIconEl);

        // Create p tag with previous temperature
        var previousTempEl = document.createElement('p');
        var previousTempNode = document.createTextNode('Temp: ' + previousTemp + ' °F');
        previousTempEl.appendChild(previousTempNode);
        newTagEl.appendChild(previousTempEl);

        // Create p tag with previous wind
        var previousWindSpeedEl = document.createElement('p');
        var previousWindNode = document.createTextNode('Wind: ' + previousWind + ' MPH');
        previousWindSpeedEl.appendChild(previousWindNode);
        newTagEl.appendChild(previousWindSpeedEl);

        // Create p tag with previous humidity
        var previousHumidityEl = document.createElement('p');
        var previousHumidityNode = document.createTextNode('Humidity: ' + previousHumidity + ' %');
        previousHumidityEl.appendChild(previousHumidityNode);
        newTagEl.appendChild(previousHumidityEl);
    }
}

savedCityEl.addEventListener('click', displayHistory);
cityResultsContainerEl.addEventListener('click', getCoords);
formSubmitEl.addEventListener('submit', formSubmitHandler);