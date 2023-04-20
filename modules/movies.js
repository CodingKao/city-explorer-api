'use strict';
const axios = require('axios');

async function getMovies(req, res, next) {
  try {
    let city = req.query.city;
    console.log(req.query);

    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_DB_API_KEY}&query=${city}`;
    console.log(url);

    let moviesFromAxios = await axios.get(url);
    let moviesToSend = moviesFromAxios.data.results.map(obj => new Movie(obj));
    res.status(200).send(moviesToSend);


    // check if endpoint 'movies' works on Thunder
    res.status(200).send(city);


  } catch (error) {
    next(error);
  }
}

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
module.exports = getMovies;

// export multiple functions = module.exports = {funtion1, funtion2, funtion3}
