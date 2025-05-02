import { renderHome } from "../pages/home";
import { renderForecast } from "../pages/forecast";
import { getWeatherForecast } from "./weather-api";

export class DomController {
  loadHomePage() {
    this.clearBody();
    let body = document.querySelector('body');
    let home = renderHome();

    body.appendChild(home);

    let homeForm = home.querySelector('#home-form');
    let homeFindLocation = home.querySelector('.find-location');

    homeForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let input = homeForm.querySelector('.search-location');
      
      this.showHomeLoading(`Fetching data for ${input.value}`);

      getWeatherForecast(input.value)
        .then( data => {
          this.loadForecastPage(data);
        })
        .catch( error => this.showHomeError(error.message));
    })

    homeFindLocation.addEventListener('click', (e) => {
      let userMessageDiv = document.querySelector('#home-form .home-user-message');

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {

          this.showHomeLoading(`Fetching data for ${position.coords.latitude},${position.coords.longitude}`);

          getWeatherForecast(`${position.coords.latitude},${position.coords.longitude}`)
            .then( data => {
              this.loadForecastPage(data);
            })
            .catch( error => this.showHomeError(error.message));
        });
      } else {
        userMessageDiv.textContent = "Geolocation is not supported by your browser";
      }
    });
  }

  loadForecastPage(data) {
    this.clearBody();
    let body = document.querySelector('body');
    let forecastPage = renderForecast(data);
    let logoContainer = forecastPage.querySelector('.forecast-logo-container');
    let forecastForm = forecastPage.querySelector('#forecast-form');
    let forecastFindLocation = forecastForm.querySelector('.find-location');

    logoContainer.addEventListener('click', (e) => {
      this.loadHomePage();
    })

    forecastForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let input = forecastForm.querySelector('.search-location');
      
      this.showForecastLoading(`Fetching data for ${input.value}`);

      getWeatherForecast(input.value)
        .then( data => {
          this.loadForecastPage(data);
        })
        .catch( error => this.showForecastError(error.message));

      input.value = '';
    })

    forecastFindLocation.addEventListener('click', (e) => {
      let userMessageDiv = forecastForm.querySelector('.forecast-user-message');

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {

          this.showForecastLoading(`Fetching data for ${position.coords.latitude},${position.coords.longitude}`);

          getWeatherForecast(`${position.coords.latitude},${position.coords.longitude}`)
            .then( data => {
              this.loadForecastPage(data);
            })
            .catch( error => this.showForecastError(error.message));
        });
      } else {
        userMessageDiv.textContent = "Geolocation is not supported by your browser";
      }
    });

    body.appendChild(forecastPage);
  }

  showHomeError(message) {
    let userMessageDiv = document.querySelector('#home-form .home-user-message');

    userMessageDiv.textContent = message;
  }

  showForecastError(message) {
    let userMessageDiv = document.querySelector('.forecast-user-message');

    userMessageDiv.textContent = message;

    setTimeout(() => {
      userMessageDiv.textContent = '';
    }, 5000);
  }

  showHomeLoading(message) {
    let userMessageDiv = document.querySelector('#home-form .home-user-message');

    // show loading svg
    userMessageDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="2" r="0" fill="currentColor"><animate attributeName="r" begin="0" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle><circle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(45 12 12)"><animate attributeName="r" begin="0.125s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle><circle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(90 12 12)"><animate attributeName="r" begin="0.25s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle><circle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(135 12 12)"><animate attributeName="r" begin="0.375s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle><circle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(180 12 12)"><animate attributeName="r" begin="0.5s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle><circle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(225 12 12)"><animate attributeName="r" begin="0.625s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle><circle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(270 12 12)"><animate attributeName="r" begin="0.75s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle><circle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(315 12 12)"><animate attributeName="r" begin="0.875s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle></svg>
      ${message}
    `;
  }

  showForecastLoading(message) {
    let userMessageDiv = document.querySelector('.forecast-user-message');

     // show loading svg
     userMessageDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="2" r="0" fill="currentColor"><animate attributeName="r" begin="0" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle><circle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(45 12 12)"><animate attributeName="r" begin="0.125s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle><circle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(90 12 12)"><animate attributeName="r" begin="0.25s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle><circle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(135 12 12)"><animate attributeName="r" begin="0.375s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle><circle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(180 12 12)"><animate attributeName="r" begin="0.5s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle><circle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(225 12 12)"><animate attributeName="r" begin="0.625s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle><circle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(270 12 12)"><animate attributeName="r" begin="0.75s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle><circle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(315 12 12)"><animate attributeName="r" begin="0.875s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle></svg>
     ${message}
   `;
  }

  clearBody() {
    let body = document.querySelector('body');
    body.innerHTML = '';
  }

}