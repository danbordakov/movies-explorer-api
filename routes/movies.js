const movieRouter = require("express").Router();
const {
  getMyMovies,
  postMyMovie,
  deleteMyMovie,
} = require("../controllers/movies");

movieRouter.get("/", getMyMovies);
movieRouter.post("/", postMyMovie);
movieRouter.delete("/:movieId", deleteMyMovie);

module.exports = movieRouter;
