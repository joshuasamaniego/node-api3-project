const express = require('express');
const usersRouter = require('./users/users-router');
const { logger } = require('./middleware/middleware');

const server = express();

// remember express by default cannot parse JSON in request bodies
server.use(express.json());

// global middlewares and the user's router need to be connected here
server.use('/api/users', logger, usersRouter);

// server.get('/', (req, res) => {
//   res.send(`<h2>Let's write some middleware!</h2>`);
// });

// Custom Catch-All Error Middleware
server.use((err, req, res, next) => {//eslint-disable-line
  res.status(500).json({
    message: err.message,
    stack: err.stack,
    custom: "You hit the catch-all error message. You didn't hit any proper endpoints."
  })
});

module.exports = server;
