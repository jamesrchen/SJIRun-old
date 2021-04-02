let express = require('express'),
    router = express.Router();

// Models
const User = require('../models/user_model')

router
  // Get all users
  // /api/users
  .get('/getUsers', async function(req, res) {
    const users = await User.find().sort({ distance: "desc"})
    res.send(users)
  })

  // Get only one user
  // /api/user
  .get('/getUser', async function(req, res) {
    const user = await User.find({ email: req.query.email})
    res.send(user)
  })

module.exports = router;