'use strict';
const axios = require('axios');
// const { response } = require('express');

let cache = {};
const CACHE_EXPIRATION_TIME = 2.628e+9;

async function getPhotos(req, res, next) {
  try {

    let cityImg = req.query.city;
    let key = `${cityImg}-photos`;

    if ((cache[key]) && (Date.now() - cache[key].created) < CACHE_EXPIRATION_TIME) {
      console.log('Cache hit!', cache);
      res.status(200).send(cache[key].data);

    } else {
      console.log('cache was missed!', cache);
      let url = `https://api.unsplash.com/search/photos?client_id=${process.env.UNSPLASH_API_KEY}&query=${cityImg}`;
      let imgResponse = await axios.get(url);
      let dataSend = imgResponse.data.results.map(obj => new Photo(obj));

      // add data to cache
      cache[key] = {
        data: dataSend,
        created: Date.now()
      };
      res.status(200).send(dataSend);

    }

    // check if endpoint 'photos' works on Thunder
    // res.status(200).send(cityImg);

  } catch (error) {
    next(error);
  }
}

class Photo {
  constructor(imgObj) {
    this.src = imgObj.urls.regular;
    this.alt = imgObj.alt_description;
    this.userName = imgObj.user.name;
  }
}

module.exports = getPhotos;

// export multiple functions = module.exports = {funtion1, funtion2, funtion3}

