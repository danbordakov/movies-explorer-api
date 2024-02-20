const mongoose = require("mongoose");
const validator = require("validator");

const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      validate: {
        validator(v) {
          return /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/.test(v);
        },
      },
    },
    trailerLink: {
      type: String,
      required: true,
      validate: {
        validator(v) {
          return /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/.test(v);
        },
      },
    },
    thumbnail: {
      type: String,
      required: true,
      validate: {
        validator(v) {
          return /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/.test(v);
        },
      },
    },
    owner: {
      type: String,
      required: true,
    },
    movieId: {
      type: Number,
      required: true,
    },
    nameRU: {
      type: String,
      required: true,
    },
    nameEN: {
      type: String,
      required: true,
    },
    owner:
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },

  },
  { versionKey: false, timestamps: true },
);

module.exports = mongoose.model("movie", movieSchema);
