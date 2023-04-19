'use strict';

// **** REQUIRE *** (like import but for the backend)

const express = require('express');
require('dotenv').config();
const cors = require('cors');

// set variable for weather.json
const weatherData = require('./data/weather.json');

// *** app === server - Need to call Express to create the server
const app = express();

// *** MIDDLEWARE *** allow anyone to hit our server
app.use(cors());


// Select port of the app
const PORT = process.env.PORT || 3002;


// Verifty port is running
app.listen(PORT, () => console.log(`Yay we are up on port ${PORT}`));

// **** ENDPOINTS ****
// *** 1st arg - endpoint url as a string
// *** 2nd arg - callback which will execute when that endpoint is hit
//              ** 2 parameters, request, response


// Welcome to server prompt
app.get('/', (request, response) => {
  response.status(200).send('Welcome to my server!');
});
console.log('response');

// Get user name from parameter input
// app.get('/hello', (request, response) => {
//   let firstName = request.query.firstName;
//   let lastName = request.query.lastName;

//   console.log(request.query);

//   // prompt welcome message
//   response.status(200).send(`Hello ${firstName} ${lastName}, welcome to my server`);
// });

app.get('/weather', (req, res, next) => {
  console.log('Weather endpoint hit');
  console.log('All weather data:', weatherData);
  try {
    let lat = parseFloat(req.query.lat);
    let lon = parseFloat(req.query.lon);
    let searchQuery = req.query.searchQuery;

    console.log('lat:', lat, 'lon:', lon, 'searchQuery:', searchQuery);

    let foundWeather = weatherData.find(city => city.city_name.toLowerCase() === searchQuery.toLowerCase() ||
      Math.abs(parseFloat(city.lat) - parseFloat(lat)) < 0.01 ||
      Math.abs(parseFloat(city.lon) - parseFloat(lon)) < 0.01);


    console.log('foundWeather:', foundWeather);


    // **** Trying to understand why this original code is not working ****
    // let lat = req.query.lat;
    // let lon = req.query.lon;
    // let searchQuery = req.query.searchQuery;

    // let foundWeather = weatherData.find(city => city.city_name.toLowerCase() === searchQuery.toLowerCase() && city.lat == lat && city.lon == lon);

    if (!foundWeather) {
      return res.status(404).send('No weather found');
    }

    let forecasts = foundWeather.data.map(weatherData => new Forecast(weatherData));

    res.status(200).send(forecasts);
  } catch (error) {
    next(error);
  }
});

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


// *** CATCH ALL ENDPOINT SHOULD BE THE LAST DEFINED ***
app.get('*', (request, response) => {
  response.status(404).send('This page does not exist');
});

// **** ERROR HANDLING - PLUG AND PLAY CODE FROM EXPRESS DOCS ****
app.use((error, request, response, next) => {
  console.log(error.message);
  response.status(500).send(error.message);
});
