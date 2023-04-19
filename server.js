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


// // Get user name from parameter input
// app.get('/hello', (request, response) => {
//   let firstName = request.query.firstName;
//   let lastName = request.query.lastName;

//   console.log(request.query);

//   // prompt welcome message
//   response.status(200).send(`Hello ${firstName} ${lastName}, welcome to my server`);
// });


app.get('/weather', (request,response,next)=>{
    try{
   console.log(weatherData[0].city_name);
   let locaLat = request.query.lat;
   let localLon = request.query.lon;
   let localCity = request.query.city;
   let returnedCity = weatherData.find(city => city.city_name === localCity);
   //console.log(returnedCity);
   
   let dataToSend = new Weather(returnedCity);
   dataToSend.generateWeatherData();
   console.log(dataToSend.myWeatherData);

   // let returnedWeather = weatherData.find(weather => weather.data.description === )

   response.status(200).send(dataToSend.myWeatherData);
    }catch(error){
       next(error);
    }
})

class Forecast{
   constructor(ForecastObj){
       this.cityName = ForecastObj.city_name,
       this.lattitude = ForecastObj.lon,
       this.longitude = ForecastObj.lat,
       this.data = ForecastObj.data
   }
   myForecastData =[];

   generateForecastData(){
       this.myForecastData = this.data.reduce((allForecast,dayForecast)=>{
           // console.log(dayForecast.datetime);
           // console.log(dayForecast.high_temp);
           // console.log(dayForecast.low_temp);
           allForecast.push({'date':dayForecast.datetime},{'hightemp': dayForecast.high_temp}, {'lowtemp': dayForecast.low_temp});
           return allForecast;
       },[]);
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
