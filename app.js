const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const router = require("./routes/index")
const { createUser, login, logout } = require("./controllers/users");
const auth = require("./middlewares/auth");
const errorHandler = require("./modules/errorHandler")
require("dotenv").config();
const NotFoundError = require("./errors/not-found-error");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { loginValidation, createUserValidation } = require("./modules/validation");
const limiter = require("./middlewares/rateLimit");

const { PORT = 3000, DB_PATH = "mongodb://127.0.0.1:27017/bitfilmsdb" } = process.env;

const app = express();

app.use(helmet());
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(DB_PATH);

app.use(requestLogger);

app.post("/signup", createUserValidation, createUser);
app.post("/signin", loginValidation, login);

app.use(auth);
app.use(router);
app.post("/signout", logout);

app.use("*", (req, res, next) => {
  next(new NotFoundError("Данной страницы не существует"));
});

app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT);
