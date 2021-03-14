const Users = require('../users/users-model');

function logger(req, res, next) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const timeStamp = new Date().toLocaleTimeString('en-US', options);

  console.log(`Request Method: ${req.method}`)
  console.log(`Request URL: ${req.url}`);
  console.log(`Request Timestamp: ${timeStamp}`);
  next();
}

async function validateUserId(req, res, next) {
  try {
    const {id} = req.params;
    const userAtId = await Users.getById(id);
    if(!userAtId) {
      res.status(404).json({ message: "user not found" })
    } else {
      req.userAtId = userAtId;
      console.log(req.userAtId);
      next();
    }
  } catch(err) {
    next(err);
  }
}

function validateUser(req, res, next) {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).json({ message: "missing user data" })
  } else if(!req.body.name) {
    res.status(400).json({ message: "missing required name field" })
  } else {
    next();
  }
} 

function validatePost(req, res, next) {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).json({ message: "missing post data" })
  } else if(!req.body.text) {
    res.status(400).json({ message: "missing required text field" })
  } else {
    next();
  }
}

// do not forget to expose these functions to other modules

module.exports = {
  logger,
  validateUserId, 
  validateUser,
  validatePost
}
