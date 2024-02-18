const Movie = require("../models/movie");

module.exports.getMyMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch((err) => next(err));
};

module.exports.postMyMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: 111,
  })
    .then((movie) => res.send(movie))
    .catch((err) => next(err));
};

module.exports.deleteMyMovie = (req, res, next) => {
  Movie.findByIdAndDelete(req.params.movieId)
    .then((movie) => res.send(movie))
    .catch((err) => next(err));
  // Movie.findOneAndDelete({ movieId: Number(req.params.movieId) })
  //   .then((movie) => res.send(movie))
  //   .catch((err) => next(err));
};
