const router = require("express").Router();
const movieRouter = require("./movies");
const userRouter = require("./users");
const NotFoundError = require("../errors/not-found-error");
const { loginValidation, createUserValidation } = require("../modules/validation");
const { createUser, login, logout } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.post("/signup", createUserValidation, createUser);
router.post("/signin", loginValidation, login);
router.use(auth);
router.use("/movies", movieRouter);
router.use("/users", userRouter);
router.post("/signout", logout);

router.use("*", (req, res, next) => {
  next(new NotFoundError("Данной страницы не существует"));
});

module.exports = router;
