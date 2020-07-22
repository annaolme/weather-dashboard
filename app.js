var API_KEY = 'demo';
var favorites = JSON.parse(localStorage.getItem('weatherFavs') || '[]');

function searchWeather() {
    var city = document.getElementById('city-input').value.trim();
    if (!city) return;
    fetchWeather(city);
}

function fetchWeather(city) {
    document.getElementById('error').style.display = 'none';
    document.getElementById('weather-card').style.display = 'none';

    var url = 'https://api.openweathermap.org/data/2.5/weather?q=' + encodeURIComponent(city) + '&appid=' + API_KEY + '&units=metric';

    fetch(url)
        .then(function(res) { return res.json(); })
        .then(function(data) {
            if (data.cod !== 200) {
                document.getElementById('error').style.display = 'block';
                return;
            }
            displayWeather(data);
        })
        .catch(function() {
            document.getElementById('error').style.display = 'block';
        });
}

function displayWeather(data) {
    document.getElementById('weather-card').style.display = 'block';
    document.getElementById('city-name').textContent = data.name + ', ' + data.sys.country;
    document.getElementById('temperature').textContent = Math.round(data.main.temp) + '°C';
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('humidity').textContent = data.main.humidity + '%';
    document.getElementById('wind').textContent = data.wind.speed + ' m/s';

    var icons = {
        'Clear': '☀️', 'Clouds': '☁️', 'Rain': '🌧️',
        'Snow': '❄️', 'Thunderstorm': '⛈️', 'Drizzle': '🌦️',
        'Mist': '🌫️', 'Fog': '🌫️'
    };
    document.getElementById('weather-icon').textContent = icons[data.weather[0].main] || '🌤️';
}

function addFavorite() {
    var city = document.getElementById('city-name').textContent;
    if (city && favorites.indexOf(city) === -1) {
        favorites.push(city);
        localStorage.setItem('weatherFavs', JSON.stringify(favorites));
        renderFavorites();
    }
}

function renderFavorites() {
    var list = document.getElementById('fav-list');
    list.innerHTML = '';
    for (var i = 0; i < favorites.length; i++) {
        var btn = document.createElement('button');
        btn.className = 'fav-btn';
        btn.textContent = favorites[i];
        btn.addEventListener('click', (function(c) {
            return function() { fetchWeather(c.split(',')[0].trim()); };
        })(favorites[i]));
        list.appendChild(btn);
    }
}

document.getElementById('city-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') searchWeather();
});

renderFavorites();
