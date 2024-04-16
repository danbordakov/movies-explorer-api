const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { errors } = require("celebrate");
const cors = require("cors");
const router = require("./routes/index");
const errorHandler = require("./modules/errorHandler");
require("dotenv").config();
const { requestLogger, errorLogger } = require("./middlewares/logger");
const limiter = require("./middlewares/rateLimit");

const { PORT = 3000, DB_PATH = "mongodb://127.0.0.1:27017/bitfilmsdb" } = process.env;
const options = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://diploma.bordakov.nomoredomainswork.ru",
    "http://diploma.bordakov.nomoredomainswork.ru",
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

const app = express();

app.use(cors(options));
app.use(helmet());
app.use(limiter);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(DB_PATH);

app.use(requestLogger);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
