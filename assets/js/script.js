var searchInputEl = document.querySelector("#search-input")
var formSubmitEl = document.querySelector('#search-form')
var cityResultsContainerEl = document.querySelector('#city-results')
var dataState = cityResultsContainerEl.getAttribute('data-list')
var cityName = ''

var formSubmitHandler = function (event) {
    event.preventDefault();

    var searchInput = searchInputEl.value.trim();
    if (searchInput) {
        cityName = searchInput
        getCity(searchInput);
    }
}

var getCity = function (searchInput) {

    fetchURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + searchInput + '&limit=5&appid=982e602762d0f897c0cbabd69277fd71'

    fetch(fetchURL).then(function (response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function (PromiseResult) {
        localStorage.setItem(searchInput, JSON.stringify(PromiseResult));
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
    })

}

var getCoords = function (event){
    console.log('getCoords function')
    console.log(dataState)
    if(dataState == 'true'){
        var pickCity = event.target.getAttribute('refNum');
        if (pickCity) {
            var pickCityRef = parseInt(pickCity)
            var cityResultObj = JSON.parse(localStorage.getItem(cityName))
            var latitude = cityResultObj[pickCityRef].lat
            var longitude = cityResultObj[pickCityRef].lon
            getWeather(latitude, longitude)
        }
    }
}

var getWeather = function(latitude, longitude){

    fetchURL = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude + '&appid=982e602762d0f897c0cbabd69277fd71&units=imperial'

    fetch(fetchURL).then(function (response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function (PromiseResult) {
        var weatherObj = PromiseResult.list
        console.log(weatherObj)
    })
}

// start at 4 then +8 from the index 4, 12, 20, 28, 36 = 5 day forecast at 12:00pm each day
// 


cityResultsContainerEl.addEventListener('click', getCoords)
formSubmitEl.addEventListener('submit', formSubmitHandler);