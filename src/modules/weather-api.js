// api key is hardcoded as this project is only a js project meant to showcase skills with handling api
const API_KEY = '5ef6c309cf3f42dea2b45514252304';
const BASE_URL = 'http://api.weatherapi.com/v1';

export async function getWeatherForecast(query) {
  const API_METHOD = '/forecast.json';

  let response = await fetch(`${BASE_URL}${API_METHOD}?key=${API_KEY}&q=${query}&aqi=yes`, {mode: 'cors'});

  if (!response.ok) {
    let data = await response.json();
    throw new Error(data.error.message);

  } else {
    let data = await response.json();
    return data;
  }
}

export async function searchLocation(query) {
  const API_METHOD = '/search.json';
  let data = await fetch(`${BASE_URL}${API_METHOD}?key=${API_KEY}&q=${query}`, {mode: 'cors'});
  data = await data.json();
  
  return data;
}