'use strict';

// **** REQUIRE *** (like import but for the backend)

const express = require('express');
require('dotenv').config();
const cors = require('cors');
// const axios = require('axios');

// import module
const getPhotos = require('./modules/photos');
const getMovies = require('./modules/movies');
const getWeather = require('./modules/weather');

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
app.get('/movies', getMovies);


// ***** Photos ***** //
app.get('/photos', getPhotos);


// ***** Weather ***** //
app.get('/weather', getWeather);


// *** CATCH ALL ENDPOINT SHOULD BE THE LAST DEFINED ***
app.get('*', (request, response) => {
  response.status(404).send('This page does not exist');
});

// **** ERROR HANDLING - PLUG AND PLAY CODE FROM EXPRESS DOCS ****
app.use((error, request, response, next) => {
  console.log(error.message);
  response.status(500).send(error.message);
});
