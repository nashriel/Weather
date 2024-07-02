const apiKey = 'ac3c6721539867b59e34f6e7d1457159';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

document.getElementById('searchButton').addEventListener('click', function() {
    const location = document.getElementById('locationInput').value;
    if (location) {
        fetchWeather(location);
    }
});

function fetchWeather(location) {
    const url = `${apiUrl}?q=${location}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const { main, weather, name, sys, wind, visibility, clouds, coord } = data;
            const sunTimesUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&exclude=minutely,hourly,daily,alerts&appid=${apiKey}`;
            
            document.getElementById('temperature').innerText = `${Math.round(main.temp)}°C`;
            document.getElementById('description').innerText = weather[0].description;
            document.getElementById('location').innerText = `${name}, ${sys.country}`;
            document.getElementById('time').innerText = new Date().toLocaleString();
            document.getElementById('rain').innerText = `Rain: ${clouds.all}%`;
            document.getElementById('windStatus').innerText = `${wind.speed} km/h`;
            document.getElementById('humidity').innerText = `${main.humidity}%`;
            document.getElementById('visibility').innerText = `${visibility / 1000} km`;

            fetch(sunTimesUrl)
                .then(response => response.json())
                .then(data => {
                    const { current } = data;
                    document.getElementById('uvIndex').innerText = current.uvi;
                    document.getElementById('sunTimes').innerText = `${new Date(current.sunrise * 1000).toLocaleTimeString()} - ${new Date(current.sunset * 1000).toLocaleTimeString()}`;
                    document.getElementById('airQuality').innerText = current.air_quality ? `${current.air_quality.value} ${current.air_quality.category}` : 'N/A';
                })
                .catch(error => console.error('Error fetching the sun times data:', error));
        })
        .catch(error => console.error('Error fetching the weather data:', error));
}
