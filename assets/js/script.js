var searchInputEl = document.querySelector("#search-input");
var formSubmitEl = document.querySelector('#search-form');

var formSubmitHandler = function (event) {
    event.preventDefault();

    var searchInput = searchInputEl.value.trim();
    if (searchInput) {
        getWeather(searchInput);
    }
}

var getWeather = function (searchInput) {

    fetchURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + searchInput + '&limit=5&appid=982e602762d0f897c0cbabd69277fd71'

    fetch(fetchURL).then(function (response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function (PromiseResult) {
        console.log(PromiseResult);
    })

}


formSubmitEl.addEventListener('submit', formSubmitHandler);