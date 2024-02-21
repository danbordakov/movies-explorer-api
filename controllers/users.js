const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { MongooseError, default: mongoose } = require("mongoose");
const User = require("../models/user");
const BadRequestError = require("../errors/bad-request-error");
const NotFoundError = require("../errors/not-found-error");
const ConflictError = require("../errors/conflict-error");
const UnauthorizedError = require("../errors/unauthorized-error");

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Указан несуществующий ID пользователя");
      } else {
        res.send({ name: user.name, email: user.email });
      }
    })
    .catch((err) => next(err));
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      runValidators: true,
      returnDocument: "after",
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Указан несуществующий ID пользователя");
      } else {
        res.send({ name: user.name, email: user.email });
      }
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError("Данные уже используются"));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        next(
          new BadRequestError(
            "Переданы некорректные данные при обновлении пользователя",
          ),
        );
      } else {
        next(err);
      }
    });
};

module.exports.createUser = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hash,
      name,
    });
    return res.status(201).send({
      email: user.email,
      name: user.name,
    });
  } catch (err) {
    if (err.code === 11000) {
      next(new ConflictError("Пользователь уже существует"));
    }
    if (err instanceof mongoose.Error.ValidationError) {
      next(
        new BadRequestError(
          "Переданы некорректные данные при создании пользователя",
        ),
      );
    } else {
      next(err);
    }
  }
  return null;
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new UnauthorizedError("Неправильные почта или пароль");
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      throw new UnauthorizedError("Неправильные почта или пароль");
    }
    const token = jwt.sign({ _id: user._id }, "secret-key", {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      maxAge: 604800000,
      httpOnly: true,
    });
    return res.status(200).send({ message: "Вход выполнен успешно" });
  } catch (err) {
    next(err);
  }
  return null;
};

module.exports.logout = async (req, res, next) => {
  try {
    res.clearCookie("token");
    return res.status(200).send({ message: "Выход выполнен успешно" });
  } catch (err) {
    next(err);
  }
  return null;
};
