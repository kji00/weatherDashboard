navigator.geolocation

var latitudeEl = navigator.geolocation.getCurrentPosition(lat)
var longitudeEl = navigator.geolocation.getCurrentPosition(long)

function lat(e){
    return e.coords.latitude
}

console.log(latitudeEl);

// fetchURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + p + "&lon=" + {lon} + "&appid=982e602762d0f897c0cbabd69277fd71"

// fetch(fetchURL)
// .then(function (response){
//     console.log(response.json());
// })