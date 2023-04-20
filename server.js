'use strict';

// **** REQUIRE *** (like import but for the backend)

const express = require('express');
require('dotenv').config();
const cors = require('cors');


const axios = require('axios');

// set variable for weather.json
// const weatherData = require('./data/weather.json');

// *** app === server - Need to call Express to create the server
const app = express();

// *** MIDDLEWARE *** allow anyone to hit our server
app.use(cors());


// Select port of the app
const PORT = process.env.PORT || 3003;


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
console.log('Welcome to my server!');


// ***** Movie ***** //

app.get('/movies', async (req, res, next) => {
  try {
    let city = req.query.city;
    console.log(req.query);

    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_DB_API_KEY}&query=${city}`;
    console.log(url);

    let moviesFromAxios = await axios.get(url);
    let moviesToSend = moviesFromAxios.data.results.map(obj=> new Movie(obj));
    res.status(200).send(moviesToSend);


    // check if endpoint 'movies' works on Thunder
    res.status(200).send(city);


  } catch (error) {
    next(error);
  }
});


// movie object & its properties
class Movie {
  constructor(movieObj) {
    this.title = movieObj.title;
    this.poster = movieObj.poster_path;
    this.releaseDate = movieObj.release_date;
    this.overview = movieObj.overview;
    this.voteAverage = movieObj.vote_average;
    this.voteCount = movieObj.vote_count;
    this.id = movieObj.id;
  }
}

app.get('/photos', async (req, res, next) => {
  try {
    let cityImg = req.query.city;
    let url = `https://api.unsplash.com/search/photos?client_id=${process.env.UNSPLASH_API_KEY}&query=${cityImg}`;
    let imgResponse = await axios.get(url);
    let dataSend = imgResponse.data.results.map(obj => new Photo(obj));
    res.status(200).send(dataSend);

    // check if endpoint 'photos' works on Thunder
    res.status(200).send(cityImg);

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



// ***** Weather ***** //
app.get('/weather', async (req, res, next) => {
  try {
    let lat = req.query.lat;
    let lon = req.query.lon;
    let url = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHERBIT_API_KEY}&lat=${lat}&lon=${lon}`;

    // check if endpoint 'weather' works on Thunder lat 47.60621 lon -122.33207
    // res.status(200).send(lat,lon);
    console.log('URL:', url); // request URL

    let weatherAPI= await axios.get(url);
    let forecasts = weatherAPI.data.data.map(obj => new Forecast(obj));

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
