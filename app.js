document.addEventListener("DOMContentLoaded", function() {
  const apiKey = "NyGGrpMCEPIXFJJ5Uk77v9rh9MuHEjAv"; // Replace with your actual API key
  const form = document.getElementById("cityForm");
  const weatherDiv = document.getElementById("weather");

  form.addEventListener("submit", function(event) {
    event.preventDefault();
    const city = document.getElementById("cityInput").value;
    getWeather(city);
  });

  function getWeather(city) {
    const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          const locationKey = data[0].Key;
          const locationName = data[0].LocalizedName;
          fetchCurrentConditions(locationKey, locationName);
          fetchHourlyForecast(locationKey);
          fetch5DayForecast(locationKey);
        } else {
          weatherDiv.innerHTML = `<p>City not found.</p>`;
        }
      })
      .catch(error => {
        console.error("Error fetching location data:", error);
        weatherDiv.innerHTML = `<p>Error fetching location data.</p>`;
      });
  }

  function fetchCurrentConditions(locationKey, locationName) {
    const url = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          displayCurrentConditions(data[0], locationName);
        } else {
          weatherDiv.innerHTML += `<p>No current conditions data available.</p>`;
        }
      })
      .catch(error => {
        console.error("Error fetching current conditions data:", error);
        weatherDiv.innerHTML += `<p>Error fetching current conditions data.</p>`;
      });
  }

  function displayCurrentConditions(currentConditions, locationName) {
    const weatherIcon = currentConditions.WeatherIcon;
    const weatherText = currentConditions.WeatherText;
    const temperature = currentConditions.Temperature.Metric.Value;

    const currentConditionsContent = `
      <div class="weather-card">
      <h1>Todays Forecast</h1>
        <h2>${locationName}</h2>
        <img src="https://developer.accuweather.com/sites/default/files/${weatherIcon < 10 ? '0' : ''}${weatherIcon}-s.png" alt="${weatherText}" />
        <p>${weatherText}</p>
        <p>${temperature}°C</p>
      </div>
    `;

    weatherDiv.innerHTML = currentConditionsContent;
  }

  function fetchHourlyForecast(locationKey) {
    const url = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${apiKey}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          displayHourlyForecast(data);
        } else {
          weatherDiv.innerHTML += `<p>No hourly forecast data available.</p>`;
        }
      })
      .catch(error => {
        console.error("Error fetching hourly forecast data:", error);
        weatherDiv.innerHTML += `<p>Error fetching hourly forecast data.</p>`;
      });
  }

  function displayHourlyForecast(hourlyForecasts) {
    let hourlyForecastContent = `
      <h2>Hourly Forecast</h2>
      <ul>
    `;

    hourlyForecasts.forEach(forecast => {
      const date = new Date(forecast.DateTime);
      const time = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
      const temperature = forecast.Temperature.Value;
      const weatherIcon = forecast.WeatherIcon;
      const weather = forecast.IconPhrase;

      const hourlyForecastItem = `
        <li>
          <p>${time}</p>
          <img src="https://developer.accuweather.com/sites/default/files/${weatherIcon < 10 ? '0' : ''}${weatherIcon}-s.png" alt="${weather}" />
          <p>${temperature}°C</p>
          <p>${weather}</p>
        </li>
      `;

      hourlyForecastContent += hourlyForecastItem;
    });

    hourlyForecastContent += `
      </ul>
    `;

    weatherDiv.innerHTML += hourlyForecastContent;
  }

  function fetch5DayForecast(locationKey) {
    const url = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data && data.DailyForecasts) {
          display5DayForecast(data.DailyForecasts);
        } else {
          weatherDiv.innerHTML += `<p>No 5-day forecast data available.</p>`;
        }
      })
      .catch(error => {
        console.error("Error fetching 5-day forecast data:", error);
        weatherDiv.innerHTML += `<p>Error fetching 5-day forecast data.</p>`;
      });
  }

  function display5DayForecast(dailyForecasts) {
    let fiveDayForecastContent = `
      <h2>5-Day Forecast</h2>
      <ul>
    `;

    dailyForecasts.forEach(forecast => {
      const date = new Date(forecast.Date);
      const dayOfWeek = date.toLocaleDateString(undefined, { weekday: "long" });
      const temperatureMin = forecast.Temperature.Minimum.Value;
      const temperatureMax = forecast.Temperature.Maximum.Value;
      const weatherIcon = forecast.Day.Icon;
      const weather = forecast.Day.IconPhrase;

      const fiveDayForecastItem = `
        <li>
          <p>${dayOfWeek}</p>
          <img src="https://developer.accuweather.com/sites/default/files/${weatherIcon < 10 ? '0' : ''}${weatherIcon}-s.png" alt="${weather}" />
          <p>${temperatureMin}°C / ${temperatureMax}°C</p>
          <p>${weather}</p>
        </li>
      `;

      fiveDayForecastContent += fiveDayForecastItem;
    });

    fiveDayForecastContent += `
      </ul>
    `;

    weatherDiv.innerHTML += fiveDayForecastContent;
  }
});
