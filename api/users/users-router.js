const express = require('express');
// You will need `users-model.js` and `posts-model.js` both
const Users = require('./users-model');
const Posts = require('../posts/posts-model');
// The middleware functions also need to be required
const { validateUserId, validateUser, validatePost } = require('../middleware/middleware');

const router = express.Router();

router.get('/', async (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  try {
    const users = await Users.get();
    res.json(users);
  } catch(err) { next(err) }
});

router.get('/:id', validateUserId, (req, res, next) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.json(req.userAtId);
  next();
});

router.post('/', validateUser, async (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
    try {
      const newUser = await Users.insert(req.body);
      res.status(201).json(newUser);
    } catch(err) { next(err) }
});

router.put('/:id', validateUserId, validateUser, async (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  try { 
    const updatedUser = await Users.update(req.params.id);
    res.json(updatedUser);
  } catch(err) { next(err) }
});

router.delete('/:id', validateUserId, async (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  try { 
    const deleted = await Users.remove(req.params.id);
    console.log(deleted);
    res.json(deleted);
  } catch(err) { next(err) }
});

router.get('/:id/posts', validateUserId, async (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  try { 
    const deleted = await Posts.getById(req.params.id);
    res.json(deleted);
  } catch(err) { next(err) }
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  try {
    const newPostAtId = await Posts.insert(req.body);
    res.status(201).json(newPostAtId);
  } catch(err) { next(err) }
});

// do not forget to export the router

module.exports = router;
