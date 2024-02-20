const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
	windowMs: 600,
	limit: 100,
});

module.exports = limiter;
