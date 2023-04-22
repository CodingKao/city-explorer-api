'use strict';

const axios = require('axios');

let cache = {};
const CACHE_EXPIRATION_TIME = 2.628e+9;

async function getMovies(req, res, next) {
  try {
    let city = req.query.city;
    let key = `${city}`;

    if ((cache[key]) && (Date.now() - cache[key].created) < CACHE_EXPIRATION_TIME) {
      console.log('Cache hit!', cache);
      res.status(200).send(cache[key].data);

    } else {
      console.log('Cache miss!', cache);
      let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_DB_API_KEY}&query=${city}`;
      console.log(url);

      let moviesFromAxios = await axios.get(url);
      let moviesToSend = moviesFromAxios.data.results.map(obj => new Movie(obj));

      cache[key] = {
        data: moviesToSend,
        created: Date.now()
      };

      res.status(200).send(moviesToSend);
    }


    // check if endpoint 'movies' works on Thunder
    // res.status(200).send(city);


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
