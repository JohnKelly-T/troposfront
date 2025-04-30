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

  let midContainer = document.createElement('div');
  midContainer.classList.add('mid-container');
  midContainer.classList.add('main-card');

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