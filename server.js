'use strict';

// **** REQUIRE **** like import but for the backend

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const axios = require('axios');

// App now === server - Need to call express to create the server
const app = express();

// **** MIDDLEWARE **** Allow anyone to hit our server
app.use(cors());

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => console.log(`listening on ${PORT}`));

// **** ENDPOINTS ****
// **** 1st arg - endpoint URL, 2nd arg - callback which will execute when endpoint is hit
// **** 2 parameters - request, response
app.get('/', (req, res) => {
  res.status(200).send('Welcome to my server!');
});

// **** Weather goes here ****

app.get('/movies', async (req, res, next) => {
  try {
    let movieImg = req.query.city;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_DB_API_KEY}&language=en-US&query=${movieImg}`;

    let movieResponse = await axios.get(url);

    let dataSend = movieResponse.data.results.map(obj => new Movie(obj));

    res.status(200).send(dataSend);

  } catch (error) {
    next(error);
  }
});

class Movie {
  constructor(movieObj) {
    this.title = movieObj.title;
    this.poster = movieObj.poster_path;
  }
}

app.get('/photos', async (req, res, next) => {
  try {
    let cityImg = req.query.city;
    let url = `https://api.unsplash.com/search/photos?client_id=${process.env.UNSPLASH_API_KEY}&query=${cityImg}`;

    let imgResponse = await axios.get(url);

    let dataSend = imgResponse.data.results.map(obj => new Photo(obj));

    res.status(200).send(dataSend);
  } catch (error) {
    next(error);
  }
});

class Photo {
  constructor(imgObj) {
    this.src = imgObj.urls.regular;
    this.alt = imgObj.alt_description;
    this.userName = imgObj.user.name;
  }
}

app.get('/weather', async (req, res, next) => {

  try {
    let lat = parseFloat(req.query.lat);
    let lon = parseFloat(req.query.lon);
    let searchQuery = req.query.searchQuery;

    let url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHERBIT_API_KEY}&query=${searchQuery}&lat=${lat}&lon=${lon}&days=16`;

    console.log('URL:', url); // request URL

    let weatherResponse = await axios.get(url);

    let forecasts = weatherResponse.data.data.map(weatherData => new Forecast(weatherData));

    console.log('Forecasts:', forecasts); // mapped forecasts

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
  }
}

// **** CATCH ALL SHOULD BE THE LAST DEFINED ****
app.get('*', (req, res) => {
  res.status(404).send('This page is not available');
});

app.use((error, req, res, next) => {
  console.log(error.message);
  res.status(500).send(error.message);
});

