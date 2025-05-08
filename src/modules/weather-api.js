// api key is hardcoded as this project is only a js project meant to showcase skills with handling api
const API_KEY = '9R2JK2KL7BTWKDZLDU3SZ2VFH';
const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';

export async function getWeatherForecast(query) {
  let response = await fetch(`${BASE_URL}${query}?key=${API_KEY}&unitGroup=metric&include=hours,current&elements=aqius,conditions,datetime,feelslike,humidity,precip,pressure,sunrise,sunset,temp,uvindex,windspeed,tempmax,tempmin,description,icon,address`, {mode: 'cors'});

  if (!response.ok) {
    if (response.status === 400 || response.status === 404) {
      throw new Error(`Sorry, we couldn't find any results for ${query}`);
    } else if (response.status === 401) {
      throw new Error("Sorry, the api is having problems, or you do not have proper access");
    } else if (response.status === 429) {
      throw new Error("Too many requests");
    } else if (response.status === 500) {
      throw new Error("An error has occurred processing the request");
    } else {
      throw new Error("An unknown error has occurred");
    }

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