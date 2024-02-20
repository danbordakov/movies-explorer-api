const Movie = require("../models/movie");
const ForbiddenError = require("../errors/forbidden-error");
const NotFoundError = require("../errors/not-found-error");

module.exports.getMyMovies = (req, res, next) => {
  Movie.find({"owner": req.user._id})
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
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => next(err));
};

// module.exports.deleteMyMovie = (req, res, next) => {
//   Movie.findByIdAndDelete(req.params.movieId)
//     .then((movie) => res.send(movie))
//     .catch((err) => next(err));
// };

// module.exports.deleteMyMovie = (req, res, next) => {
//   Movie.findById(req.params.movieId)
//     .then((movie) => {
//        if (movie.owner.toString() === req.user._id) {

//        }

// })
//     .catch((err) => next(err));
// };

module.exports.deleteMyMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError("Указан ID несуществующего фильма");
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError("Указан ID чужого фильма");
      } else {
        Movie.deleteOne(movie)
          .then(res.send(movie))
          .catch((err) => next(err));
      }
    })
    .catch((err) => next(err));
};