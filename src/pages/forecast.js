import { parse, format, add } from 'date-fns';

let airQualityStatus = {
  1: 'Good',
  2: 'Moderate',
  3: 'Unhealthy for Sensitive Group',
  4: 'Unhealthy',
  5: 'Very Unhealthy',
  6: 'Hazardous'
}

function getTempThumbPosition(temp, type) {
  if (type === 'celsius') {
    if (temp < 0) {
      return '0%';
    } else if (temp > 50) {
      return '100%';
    } else {
      return ((temp / 50) * 100) + '%';
    }
  }
}

async function getWeatherIcon(code) {
  let result;

  switch (code) {
    case 'clear-day':
      result = await import('../assets/img/clear-day.svg');
      break;
    case 'clear-night':
      result =  await import('../assets/img/clear-night.svg');
      break
    case 'partly-cloudy-day':
      result = await import('../assets/img/partly-cloudy-day.svg');
      break;
    case 'partly-cloudy-night':
      result = await import('../assets/img/partly-cloudy-night.svg');
      break;
    case 'cloudy':
      result = await import('../assets/img/cloudy.svg');
      break;
    case 'wind': 
      result = await import('../assets/img/wind.svg');
      break
    case 'rain':
      result = await import('../assets/img/rain.svg');
      break;
    case 'snow':
    case 'snow-showers-day':
    case 'snow-showers-night':
      result = await import('../assets/img/snow.svg');
      break;
    case 'thunder-rain':
    case 'thunder-showers-day':
    case 'thunder-showers-night':
      result = await import('../assets/img/thunder.svg');
      break;
    case 'fog':
      result = await import('../assets/img/fog.svg');
      break;
  }

  let iconSrc;

  if (result) {
    iconSrc = result.default;
  } else {
    iconSrc = '#';
  }
  
  return iconSrc;
}

export function renderForecast(data, coords) {
  
  let forecastContainer = document.createElement('div');
  forecastContainer.classList.add('forecast-container');

  // forecast header
  let forecastHeader = document.createElement('div');
  forecastHeader.classList.add('forecast-header');

  let forecastLogoContainer = document.createElement('div');
  forecastLogoContainer.classList.add('forecast-logo-container');
  forecastLogoContainer.innerHTML = 
  `
     <div class="forecast-logo-container">
          <div class="forecast-logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 2c3.292 0 6 2.435 6 5.5c0 1.337-.515 2.554-1.369 3.5H21a1 1 0 0 1 1 1c0 3.292-2.435 6-5.5 6c-1.336 0-2.553-.515-3.5-1.368V21a1 1 0 0 1-1 1c-3.292 0-6-2.435-6-5.5c0-1.336.515-2.553 1.368-3.5H3a1 1 0 0 1-1-1c0-3.292 2.435-6 5.5-6c1.337 0 2.554.515 3.5 1.369V3a1 1 0 0 1 1-1"
              ></path>
            </svg>
          </div>
          <div class="site-name">TroposFront</div>
        </div>
  `;

  let forecastForm = document.createElement('form');
  forecastForm.id = 'forecast-form';
  forecastForm.innerHTML = 
  `
    <button class="find-location" type="button">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="m15.94 7.62l-4.88 2a2.63 2.63 0 0 0-1.48 1.48l-2 4.88a.34.34 0 0 0 .19.44a.36.36 0 0 0 .25 0l4.88-2a2.63 2.63 0 0 0 1.48-1.48l2-4.88a.34.34 0 0 0-.19-.44a.36.36 0 0 0-.25 0M12 13a1 1 0 1 1 1-1a1 1 0 0 1-1 1"
        ></path>
        <path
          fill="currentColor"
          d="M12 21a9 9 0 1 1 9-9a9 9 0 0 1-9 9m0-16.5a7.5 7.5 0 1 0 7.5 7.5A7.5 7.5 0 0 0 12 4.5"
        ></path>
      </svg>
    </button>
    <input
      type="text"
      class="search-location"
      placeholder="Search Location..."
    />
    <div class="forecast-user-message"></div>
  `;

  let refreshBtn = document.createElement('button');
  refreshBtn.id = 'refresh-btn';
  refreshBtn.innerHTML = 
  `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M17.65 6.35a7.95 7.95 0 0 0-6.48-2.31c-3.67.37-6.69 3.35-7.1 7.02C3.52 15.91 7.27 20 12 20a7.98 7.98 0 0 0 7.21-4.56c.32-.67-.16-1.44-.9-1.44c-.37 0-.72.2-.88.53a5.994 5.994 0 0 1-6.8 3.31c-2.22-.49-4.01-2.3-4.48-4.52A6.002 6.002 0 0 1 12 6c1.66 0 3.14.69 4.22 1.78l-1.51 1.51c-.63.63-.19 1.71.7 1.71H19c.55 0 1-.45 1-1V6.41c0-.89-1.08-1.34-1.71-.71z"
      />
    </svg>
  `;

  forecastHeader.appendChild(forecastLogoContainer);
  forecastHeader.appendChild(forecastForm);
  forecastHeader.appendChild(refreshBtn);


  let forecastDashboard = document.createElement('div');
  forecastDashboard.classList.add('forecast-dashboard');

  let leftContainer = document.createElement('div');
  leftContainer.classList.add('left-container');

  let aqCard = document.createElement('div');
  aqCard.classList.add('aq-card');

  let aqi = data.currentConditions.aqius;
  let aqiCode;
  let aqClass;

  if (aqi <= 50) {
    aqClass = 'aq-1';
    aqiCode = 1;
  } else if (aqi <= 100) {
    aqClass = 'aq-2';
    aqiCode = 2;
  } else if (aqi <= 150) {
    aqClass = 'aq-3';
    aqiCode = 3;
  } else if (aqi <= 200) {
    aqClass = 'aq-4';
    aqiCode = 4;
  } else if (aqi <= 300) {
    aqClass = 'aq-5';
    aqiCode = 5;
  } else if (aqi <= 500) {
    aqClass = 'aq-6';
    aqiCode = 6;
  }

  aqCard.innerHTML = 
  `
  <div class="aq-label">Air Quality</div>
  <div class="aq-status-container ${aqClass}">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2M9.6 17.2c-.22 0-.52-.08-.8-.2l-.57 1.4l-1.14-.4l.16-.39C8.45 14.59 9.83 11.15 15 10c0 0-6 0-7.95 5.55c0 0-1.05-1.05-1.05-2.25s1.2-3.75 4.2-4.35c.85-.17 1.8-.3 2.74-.45C15.3 8.18 17.57 7.86 18 7c0 0-1.8 10.2-8.4 10.2"
      />
    </svg>
    <div class="aq-status">${airQualityStatus[aqiCode]}</div>
  `;

  let feelsLikeCard = document.createElement('div');
  feelsLikeCard.classList.add('feels-like-card');

  let tempBar = document.createElement('div');
  tempBar.classList.add('temp-bar');

  let tempThumb = document.createElement('div');
  tempThumb.classList.add('temp-thumb');

  let thumbPosition = getTempThumbPosition(data.currentConditions.feelslike, 'celsius');

  tempThumb.style.bottom = thumbPosition;

  tempBar.appendChild(tempThumb);

  let feelsLikeTemp = document.createElement('div');
  feelsLikeTemp.classList.add('feels-like-temp');
  feelsLikeTemp.textContent = data.currentConditions.feelslike;

  let feelsLikeLabel = document.createElement('div');
  feelsLikeLabel.classList.add('feels-like-label');
  feelsLikeLabel.textContent = 'Feels Like';

  feelsLikeCard.appendChild(tempBar);
  feelsLikeCard.appendChild(feelsLikeTemp);
  feelsLikeCard.appendChild(feelsLikeLabel);

  leftContainer.appendChild(aqCard);
  leftContainer.appendChild(feelsLikeCard);

  let midContainer = document.createElement('div');
  midContainer.classList.add('mid-container');
  midContainer.classList.add('main-card');

  let currentDate = new Date(`${data.days[0].datetime} ${data.currentConditions.datetime}`);

  let resolvedAddress = data.resolvedAddress.split(",");

  let location = resolvedAddress[0];
  let region = resolvedAddress[1] ? resolvedAddress[1] : '';
  let country = resolvedAddress[2] ? resolvedAddress[2] : '';
  let tempToday = data.currentConditions.temp;
  let maxTemp = data.days[0].tempmax;
  let minTemp = data.days[0].tempmin;
  let conditionDescription = data.days[0].description;
  let conditionCode = data.days[0].icon;
  // let isDay = (currentDate.getHours() >= 5) && (currentDate.getHours() <= 19)? true : false;
  let hourlyForecastToday = data.days[0].hours;
  let hourlyForecastTomorrow = data.days[1].hours;

  if (coords) {
    location = data.address;
    region = '';
    country = '';
  }

  // if (conditionDescription === 'Sunny' && !isDay) {
  //   conditionDescription = 'Clear';
  // }

  midContainer.innerHTML = 
  `
    <div class="main-card-header">
      <div class="main-card-date">${format(currentDate, 'EE, MMM dd')}</div>
      <div class="main-card-time">${format(currentDate, 'h:mmaaa')}</div>
    </div>

    <div class="location-name">${location}</div>
    <div class="location-region-and-country">${region}, ${country}</div>

    <div class="temp-today">${tempToday}</div>
    <div class="temp-high-low">${maxTemp}° / ${minTemp}°</div>

    <div class="condition-container">
      <div class="condition-text">${conditionDescription}</div>
      <img class="condition-icon" src=""></img>
    </div>

    <div class="hourly-forecast-container"></div>
  `
  ;

  let mainCardIcon = midContainer.querySelector('.condition-icon');
  getWeatherIcon(conditionCode).then(result => {
    mainCardIcon.src = result;
  });

  let hourlyForecastContainer = midContainer.querySelector('.hourly-forecast-container');

  let hourNow = currentDate.getHours();
  // append hours today
  for (let i = hourNow; i < 24; i++) {
    let hourlyForecast = document.createElement('div');
    hourlyForecast.classList.add('hourly-forecast');

    let hourlyTemp = document.createElement('div');
    hourlyTemp.classList.add('hourly-temp');
    hourlyTemp.textContent = hourlyForecastToday[i].temp;

    let hourlyTime = document.createElement('div');
    hourlyTime.classList.add('hourly-time');

    if (i === hourNow) {
      hourlyTime.textContent = 'Now';
    } else {
      hourlyTime.textContent = format(parse(
        hourlyForecastToday[i].datetime,
        'HH:mm:ss',
        new Date()
      ), 'H:mm');
    }

    hourlyForecast.appendChild(hourlyTemp);
    hourlyForecast.appendChild(hourlyTime);

    hourlyForecastContainer.appendChild(hourlyForecast);
  }

  // append hours tomorrow
  for (let i = 0; i < hourNow; i++) {
    let hourlyForecast = document.createElement('div');
    hourlyForecast.classList.add('hourly-forecast');

    let hourlyTemp = document.createElement('div');
    hourlyTemp.classList.add('hourly-temp');
    hourlyTemp.textContent = hourlyForecastTomorrow[i].temp;

    let hourlyTime = document.createElement('div');
    hourlyTime.classList.add('hourly-time');

    if (i === 0) {
      hourlyTime.textContent = format(add(currentDate, {days: 1}), 'M/dd');
    } else {
      hourlyTime.textContent = format(parse(
        hourlyForecastTomorrow[i].datetime,
        'HH:mm:ss',
        new Date()
      ), 'H:mm');
    }

    hourlyForecast.appendChild(hourlyTemp);
    hourlyForecast.appendChild(hourlyTime);

    hourlyForecastContainer.appendChild(hourlyForecast);
  }

  let rightContainer = document.createElement('div');
  rightContainer.classList.add('right-container');

  let dailyForecastContainer = document.createElement('div');
  dailyForecastContainer.classList.add('daily-forecast-container');

  let dailyForecastLabel = document.createElement('div');
  dailyForecastLabel.classList.add('daily-forecast-label');
  dailyForecastLabel.textContent = '5-day Forecast';

  dailyForecastContainer.appendChild(dailyForecastLabel);

  for (let i = 0; i < 5; i++) {
    let dailyForecast = document.createElement('div');
    dailyForecast.classList.add('daily-forecast');

    let dailyLabel;

    if (i === 0) {
      dailyLabel = 'Today';
    } else if (i === 1) {
      dailyLabel = 'Tomorrow';
    } else {
      dailyLabel = format(new Date(data.days[0].datetime), 'EEE');
    }
    
    let dailyConditionText = data.days[i].conditions;
    
    dailyForecast.innerHTML = 
    `
      <div class="daily-label">${dailyLabel}</div>
      <img class="daily-condition-icon">
      <div class="daily-condition-text">${dailyConditionText}</div>
    `;


    let dailyConditionCode = data.days[i].icon;

    let dailyConditionIcon = dailyForecast.querySelector('.daily-condition-icon');

    if (i === 0) {
      getWeatherIcon(dailyConditionCode).then(result => {
        dailyConditionIcon.src = result;
      })
    } else {
      getWeatherIcon(dailyConditionCode, true).then(result => {
        dailyConditionIcon.src = result;
      })
    }

    dailyForecastContainer.appendChild(dailyForecast);
  }

  let extraInfoContainer = document.createElement('div');
  extraInfoContainer.classList.add('extra-info-container');

  let precipitationCard = document.createElement('div');
  precipitationCard.classList.add('extra-info-card');
  precipitationCard.id = 'precipitation';

  let precipitationText = document.createElement('div');
  precipitationText.classList.add('extra-info-text');
  precipitationText.textContent = 'Precipitation';

  let precipitationValue = document.createElement('div');
  precipitationValue.classList.add('extra-info-value');
  precipitationValue.setAttribute('data-after', 'mm');
  precipitationValue.textContent = data.currentConditions.precip;

  let precipitationIcon = document.createElement('img');
  precipitationIcon.classList.add('extra-info-icon');

  import('../assets/img/precipitation.svg').then( result => {
    precipitationIcon.src = result.default;
  });

  precipitationCard.appendChild(precipitationText);
  precipitationCard.appendChild(precipitationValue);
  precipitationCard.appendChild(precipitationIcon);

  let windSpeedCard = document.createElement('div');
  windSpeedCard.classList.add('extra-info-card');
  windSpeedCard.id = 'wind-speed';

  let windSpeedText = document.createElement('div');
  windSpeedText.classList.add('extra-info-text');
  windSpeedText.textContent = 'Wind Speed';

  let windSpeedValue = document.createElement('div');
  windSpeedValue.classList.add('extra-info-value');
  windSpeedValue.setAttribute('data-after', 'kph');
  windSpeedValue.textContent = data.currentConditions.windspeed;

  let windSpeedIcon = document.createElement('img');
  windSpeedIcon.classList.add('extra-info-icon');

  import('../assets/img/wind-speed.svg').then( result => {
    windSpeedIcon.src = result.default;
  });

  windSpeedCard.appendChild(windSpeedText);
  windSpeedCard.appendChild(windSpeedValue);
  windSpeedCard.appendChild(windSpeedIcon);

  let humidityCard = document.createElement('div');
  humidityCard.classList.add('extra-info-card');
  humidityCard.id = 'humidity';

  let humidityText = document.createElement('div');
  humidityText.classList.add('extra-info-text');
  humidityText.textContent = 'Humidity';

  let humidityValue = document.createElement('div');
  humidityValue.classList.add('extra-info-value');
  humidityValue.setAttribute('data-after', '%');
  humidityValue.textContent = data.currentConditions.humidity;

  let humidityIcon = document.createElement('img');
  humidityIcon.classList.add('extra-info-icon');

  import('../assets/img/humidity.svg').then( result => {
    humidityIcon.src = result.default;
  });

  humidityCard.appendChild(humidityText);
  humidityCard.appendChild(humidityValue);
  humidityCard.appendChild(humidityIcon);

  let pressureCard = document.createElement('div');
  pressureCard.classList.add('extra-info-card');
  pressureCard.id = 'pressure';

  let pressureText = document.createElement('div');
  pressureText.classList.add('extra-info-text');
  pressureText.textContent = 'Pressure';

  let pressureValue = document.createElement('div');
  pressureValue.classList.add('extra-info-value');
  pressureValue.setAttribute('data-after', 'mb');
  pressureValue.textContent = data.currentConditions.pressure;

  let pressureIcon = document.createElement('img');
  pressureIcon.classList.add('extra-info-icon');

  import('../assets/img/pressure.svg').then( result => {
    pressureIcon.src = result.default;
  });

  pressureCard.appendChild(pressureText);
  pressureCard.appendChild(pressureValue);
  pressureCard.appendChild(pressureIcon);

  extraInfoContainer.appendChild(precipitationCard);
  extraInfoContainer.appendChild(windSpeedCard);
  extraInfoContainer.appendChild(humidityCard);
  extraInfoContainer.appendChild(pressureCard);

  let extraInfo2Container = document.createElement('div');
  extraInfo2Container.classList.add('extra-info-2-container');

  let sunriseTime = parse(
    data.currentConditions.sunrise,
    'HH:mm:ss',
    new Date()
  );

  let sunsetTime = parse(
    data.currentConditions.sunset,
    'HH:mm:ss',
    new Date()
  );

  let sunriseHour = sunriseTime.getHours();
  let sunsetHour = sunsetTime.getHours();

  if (hourNow === sunriseHour) {
    document.documentElement.className = 'sunrise';
  } else if (hourNow === sunsetHour) {
    document.documentElement.className = 'sunset';
  } else if (hourNow >= 19 || hourNow < 6) {
    document.documentElement.className = 'night';
  } else {
    document.documentElement.className = '';
  }

  let uvIndex = Math.floor(data.currentConditions.uvindex);
  let uvClass;
  let uvText;

  if (uvIndex <= 2) {
    uvClass = 'uv-low';
    uvText = 'Low';
  } else if (uvIndex <= 5) {
    uvClass = 'uv-moderate';
    uvText = 'Moderate';
  } else if (uvIndex <= 7) {
    uvClass = 'uv-high';
    uvText = 'High';
  } else if (uvIndex <= 10) {
    uvClass = 'uv-very-high';
    uvText = 'Very High';
  } else if (uvIndex > 10) {
    uvClass = 'uv-extreme';
    uvText = 'Extreme';
  }

  extraInfo2Container.innerHTML = 
  `
    <div class="sunrise-sunset">
      <div class="sunrise-sunset-card">
        <div class="sunrise-sunset-time" id="sunrise">${format(sunriseTime, 'h:mm')}</div>
        <img class="sunrise-sunset-icon">
        <div class="sunrise-sunset-text">Sunrise</div>
      </div>

      <div class="sunrise-sunset-card">
        <div class="sunrise-sunset-time" id="sunset">${format(sunsetTime, 'h:mm')}</div>
        <img class="sunrise-sunset-icon">
        <div class="sunrise-sunset-text">Sunset</div>
      </div>
    </div>

    <div class="uv-card">
      <div class="uv-info ${uvClass}">
        <div class="uv-number">${uvIndex}</div>
        <div class="uv-text">${uvText}</div>
      </div>
      <img alt="" class="uv-icon">
    </div>
  `;

  let sunriseSunsetIcons = extraInfo2Container.querySelectorAll('.sunrise-sunset-icon');

  import('../assets/img/sunrise.svg').then(result => {
    sunriseSunsetIcons[0].src = result.default;
  });
  
  import('../assets/img/sunset.svg').then(result => {
    sunriseSunsetIcons[1].src = result.default;
  });

  let uvIcon = extraInfo2Container.querySelector('.uv-icon');

  import('../assets/img/uv.svg').then(result => {
    uvIcon.src = result.default;
  });

  rightContainer.appendChild(dailyForecastContainer);
  rightContainer.appendChild(extraInfoContainer);
  rightContainer.appendChild(extraInfo2Container);

  forecastDashboard.appendChild(leftContainer);
  forecastDashboard.appendChild(midContainer);
  forecastDashboard.appendChild(rightContainer);

  let forecastFooter = document.createElement('div');
  forecastFooter.classList.add('forecast-footer');
  forecastFooter.innerHTML = 
  `
    <div class="credit">
      Icons from <a href="https://iconify.design/">Iconify</a>
    
      | Powered by
      <a href="https://www.visualcrossing.com/" title="Free Weather API"
        >visualcrossing.com</a
      >
    </div>
  `;

  forecastContainer.appendChild(forecastHeader);
  forecastContainer.appendChild(forecastDashboard);
  forecastContainer.appendChild(forecastFooter);

  return forecastContainer;
}