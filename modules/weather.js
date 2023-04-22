'use strict';

const axios = require('axios');

let cache = {};
const CACHE_EXPIRATION_TIME = 8.64e+7;


async function getWeather(req, res, next) {
  try {
    let lat = req.query.lat;
    let lon = req.query.lon;
    let key = `lat:${lat} lon:${lon}`;

    if ((cache[key]) && (Date.now() - cache[key].created) < CACHE_EXPIRATION_TIME) {
      console.log('Cache hit!', cache);
      res.status(200).send(cache[key].data);

    } else {
      console.log('Cache miss!', cache);
      let url = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHERBIT_API_KEY}&lat=${lat}&lon=${lon}`;

      // check if endpoint 'weather' works on Thunder lat 47.60621 lon -122.33207
      // res.status(200).send(lat,lon);
      console.log('URL:', url); // request URL

      let weatherAPI = await axios.get(url);
      let forecasts = weatherAPI.data.data.map(obj => new Forecast(obj));

      console.log('Forecasts:', forecasts); // mapped forecasts

      cache[key] = {
        data: forecasts,
        created: Date.now()
      };

      res.status(200).send(forecasts);

    }

  } catch (error) {
    next(error);
  }
}

// **** CLASS TO CLEAN UP BULKY DATA ****
class Forecast {
  constructor(forecastData) {
    this.date = forecastData.datetime;
    this.description = forecastData.weather.description;
    this.minTemp = forecastData.min_temp;
    this.maxTemp = forecastData.max_temp;
    this.icon = forecastData.weather.icon;
  }
}

module.exports = getWeather;

// export multiple functions = module.exports = {funtion1, funtion2, funtion3}
