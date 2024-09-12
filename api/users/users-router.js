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
    const updatedUser = await Users.update(req.params.id, req.body);
    if(updatedUser) {
      res.json({ id: parseInt(req.params.id), name: req.body.name });
    } else {
       res.status(500).json({ message: "Update Failed" })
    }
  } catch(err) { next(err) }
});

router.delete('/:id', validateUserId, async (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  try { 
    const deleted = await Users.remove(req.userAtId.id);
    if(deleted) {
      res.json(req.userAtId);
    } else {
      res.status(500).json({ message: "delete failed" })
    }
  } catch(err) { next(err) }
});

router.get('/:id/posts', validateUserId, async (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  try { 
    const postsAtId = await Users.getUserPosts(req.userAtId.id)
    if(postsAtId) {
      res.json(postsAtId);
    } else {
      res.status(500).json({ message: "Couldn't get posts" })
    }
  } catch(err) { next(err) }
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const postObj = {
    user_id: req.params.id,
    text: req.body.text
  }
  try {
    const newPostAtId = await Posts.insert(postObj);
    if(newPostAtId) {
      res.status(201).json(newPostAtId);
    } else { 
      res.status(500).json({ message: "Couldn't add post" })
    }
  } catch(err) { next(err) }
});

// do not forget to export the router

module.exports = router;
