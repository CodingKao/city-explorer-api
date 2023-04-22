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

// *** app === server - Need to call Express to create the server
const app = express();

// *** MIDDLEWARE *** allow anyone to hit our server
app.use(cors());


// Select port of the app
const PORT = process.env.PORT || 3003;


// Verifty port is running
app.listen(PORT, () => console.log(`Yay we are up on port ${PORT}`));

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
