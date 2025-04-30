export function renderForecast(data) {
  
  let forecastContainer = document.createElement('div');

  let forecastHeader = document.createElement('div');
  forecastHeader.classList.add('forecast-header');

  let forecastDashboard = document.createElement('div');
  forecastDashboard.classList.add('forecast-dashboard');

  let forecastFooter = document.createElement('div');
  forecastFooter.classList.add('forecast-footer');

  forecastContainer.appendChild(forecastContainer);
  forecastContainer.appendChild(forecastDashboard);
  forecastContainer.appendChild(forecastFooter);
}