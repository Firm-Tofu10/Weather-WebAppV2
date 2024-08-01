function searchWeather() {
	const apiKey = '8f26704d4a67876a2b30b6d888f31d27';
	const searchInput = document.getElementById('searchInput').value;
	const useFahrenheit = document.getElementById('toggleUnit').checked;

	let units = 'metric';
	let temperatureUnit;

	if (useFahrenheit) {
			units = 'imperial';
			temperatureUnit = '°F';
	} else {
			temperatureUnit = '°C';
	}

	fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=${apiKey}&units=${units}`)
    .then(response => response.json())
    .then(data => {
        const cityName = data.name;
        const temperature = data.main.temp;
        const uvi = data.uvi; // Access UV index data directly
        const uvIndex = typeof uvi !== 'undefined' ? uvi : 'N/A'; // Check if UV index is available
        const precipitation = data.weather[0].main;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        const weatherIcon = data.weather[0].icon;

        const weatherData = `
            <h2>${cityName}</h2>
            <img src="http://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather Icon">
            <p>Temperature: ${temperature}${temperatureUnit}</p>
            <p>UV Index: ${uvIndex}</p> <!-- Display UV index -->
            <p>Precipitation: ${precipitation}</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
        `;
        document.getElementById('weatherData').innerHTML = weatherData;
    })
    .catch(error => {
        console.error('Error:', error);
    });

	fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${searchInput}&appid=${apiKey}&units=${units}`)
			.then(response => response.json())
			.then(data => {
					const forecastData = data.list.filter((item, index) => index % 8 === 0);

					const forecastHTML = forecastData.map(item => {
							const date = new Date(item.dt * 1000);
							const day = date.toLocaleDateString('en-US', { weekday: 'short' });
							const temperature = item.main.temp;
							const uvi = 'N/A';
							const precipitation = item.weather[0].main;
							const humidity = item.main.humidity;
							const windSpeed = item.wind.speed;
							const weatherIcon = item.weather[0].icon;

							return `
									<div class="forecast-item">
											<h3>${day}</h3>
											<img src="http://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather Icon">
											<p>Temperature: ${temperature}${temperatureUnit}</p>
											<p>UV Index: ${uvi}</p>
											<p>Precipitation: ${precipitation}</p>
											<p>Humidity: ${humidity}%</p>
											<p>Wind Speed: ${windSpeed} m/s</p>
									</div>
							`;
					}).join('');

					document.getElementById('weatherData').innerHTML += `
							<h3>5-Day Forecast:</h3>
							<div class="forecast">${forecastHTML}</div>
					`;
			})
			.catch(error => {
					console.error('Error:', error);
			});
}