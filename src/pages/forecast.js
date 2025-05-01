import { format } from 'date-fns';

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

async function getWeatherIcon(code, isDay) {
  let result;

  switch (code) {
    case 1000:
      result = isDay ?
      await import('../assets/img/clear-day.svg') :
      await import('../assets/img/clear-night.svg');
      break;
    case 1003:
      result = isDay ?
      await import('../assets/img/partly-cloudy-day.svg') :
      await import('../assets/img/partly-cloudy-night.svg');
      break;
    case 1006:
      result = await import('../assets/img/cloudy.svg');
      break;
    case 1009:
      result = await import('../assets/img/overcast.svg');
      break;
    case 1030:
      result = await import('../assets/img/mist.svg');
      break;
    case 1063:
    case 1072:
    case 1150:
    case 1153:
    case 1180:
    case 1183:
    case 1186:
    case 1189:
    case 1192:
    case 1195:
    case 1240:
    case 1243:
    case 1246:
      result = await import('../assets/img/rain.svg');
      break;
    case 1066:
    case 1069:
    case 1114:
    case 1117:
    case 1168:
    case 1171:
    case 1198:
    case 1201:
    case 1204:
    case 1207:
    case 1210:
    case 1213:
    case 1216:
    case 1219:
    case 1222:
    case 1225:
    case 1237:
    case 1252:
    case 1255:
    case 1261:
    case 1264:
      result = await import('../assets/img/snow.svg');
      break;
    case 1087:
    case 1273:
    case 1276:
    case 1279:
    case 1282:
      result = await import('../assets/img/thunder.svg');
      break;
    case 1135:
    case 1147:
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

export function renderForecast(data) {
  
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
    <div class="user-message"></div>
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

  let epaIndex = data.current['air_quality']['us-epa-index'];

  aqCard.innerHTML = 
  `
  <div class="aq-label">Air Quality</div>
  <div class="aq-status-container aq-${epaIndex}">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2M9.6 17.2c-.22 0-.52-.08-.8-.2l-.57 1.4l-1.14-.4l.16-.39C8.45 14.59 9.83 11.15 15 10c0 0-6 0-7.95 5.55c0 0-1.05-1.05-1.05-2.25s1.2-3.75 4.2-4.35c.85-.17 1.8-.3 2.74-.45C15.3 8.18 17.57 7.86 18 7c0 0-1.8 10.2-8.4 10.2"
      />
    </svg>
    <div class="aq-status">${airQualityStatus[epaIndex]}</div>
  `;

  let feelsLikeCard = document.createElement('div');
  feelsLikeCard.classList.add('feels-like-card');

  let tempBar = document.createElement('div');
  tempBar.classList.add('temp-bar');

  let tempThumb = document.createElement('div');
  tempThumb.classList.add('temp-thumb');

  let thumbPosition = getTempThumbPosition(data.current['feelslike_c'], 'celsius');

  tempThumb.style.bottom = thumbPosition;

  tempBar.appendChild(tempThumb);

  let feelsLikeTemp = document.createElement('div');
  feelsLikeTemp.classList.add('feels-like-temp');
  feelsLikeTemp.textContent = data.current['feelslike_c'];

  let feelsLikeLabel = document.createElement('div');
  feelsLikeLabel.textContent = 'Feels Like';

  feelsLikeCard.appendChild(tempBar);
  feelsLikeCard.appendChild(feelsLikeTemp);
  feelsLikeCard.appendChild(feelsLikeLabel);

  leftContainer.appendChild(aqCard);
  leftContainer.appendChild(feelsLikeCard);

  let midContainer = document.createElement('div');
  midContainer.classList.add('mid-container');
  midContainer.classList.add('main-card');

  let currentDate = new Date(Date.now());
  console.log(currentDate);

  let location = data.location.name;
  let region = data.location.region;
  let country = data.location.country;
  let tempToday = data.current.temp_c;
  let maxTemp = data.forecast.forecastday[0].day['maxtemp_c'];
  let minTemp = data.forecast.forecastday[0].day['mintemp_c'];
  let conditionDescription = data.forecast.forecastday[0].day.condition.text;
  let conditionCode = data.forecast.forecastday[0].day.condition.code;
  let isDay = data.current['is_day'] === 1 ? true : false;
  let hourlyForecastToday = data.forecast.forecastday[0].hour;
  let hourlyForecastTomorrow = data.forecast.forecastday[1].hour;

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
  getWeatherIcon(conditionCode, isDay).then(result => {
    mainCardIcon.src = result;
  });

  let hourlyForecastContainer = midContainer.querySelector('.hourly-forecast-container');

  let hourNow = new Date(Date.now()).getHours();

  // append hours today
  for (let i = hourNow; i < 24; i++) {
    let hourlyForecast = document.createElement('div');
    hourlyForecast.classList.add('hourly-forecast');

    let hourlyTemp = document.createElement('div');
    hourlyTemp.classList.add('hourly-temp');
    hourlyTemp.textContent = hourlyForecastToday[i]['temp_c'];

    let hourlyTime = document.createElement('div');
    hourlyTime.classList.add('hourly-time');

    if (i === hourNow) {
      hourlyTime.textContent = 'Now';
    } else {
      hourlyTime.textContent = format(new Date(hourlyForecastToday[i]['time']), 'HH:mm');
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
    hourlyTemp.textContent = hourlyForecastTomorrow[i]['temp_c'];

    let hourlyTime = document.createElement('div');
    hourlyTime.classList.add('hourly-time');

    if (i === 0) {
      hourlyTime.textContent = format(new Date(hourlyForecastTomorrow[0]['time']), 'M/dd');
    } else {
      hourlyTime.textContent = format(new Date(hourlyForecastTomorrow[i]['time']), 'HH:mm');
    }

    hourlyForecast.appendChild(hourlyTemp);
    hourlyForecast.appendChild(hourlyTime);

    hourlyForecastContainer.appendChild(hourlyForecast);
  }


  let rightContainer = document.createElement('div');
  rightContainer.classList.add('right-container');

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
      <a href="https://www.weatherapi.com/" title="Free Weather API"
        >WeatherAPI.com</a
      >
    </div>
  `;

  forecastContainer.appendChild(forecastHeader);
  forecastContainer.appendChild(forecastDashboard);
  forecastContainer.appendChild(forecastFooter);

  return forecastContainer;
}