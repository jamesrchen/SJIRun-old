let express = require('express'),
    router = express.Router();

// Models
const User = require('../models/user_model')

router
  // Allows the client to check authentication state and userinfo
  // /api/getUserInfo
  .get('/getUserInfo', async function(req, res) {

    if(!req.session.email){
      res.json({})
      return
    }

    const user = await User.findOne({email: req.session.email})
    res.json({
      "email": user.email,
      "full_name": user.full_name,
      "classroom": user.classroom,
      "stravaID": user.strava_id,
      "distance": user.distance
    })
  })

  // /api/logout
  .get('/logout', async function(req, res) {

    req.session.email = null

    res.sendStatus(200)
  })
 
  // Get leaderboard, requires sort param to be passed
  // Possible sort parameters are desc, asc, you
  // /api/getLeaderboard
  .get('/getLeaderboard', async function(req, res) {


    if(req.query.sort == "desc" || req.query.sort == "asc"){
      // Take note that null values are always lower, hence I have removed them
      
      let leaderboard = []
      const users = await User.find({distance: {$ne: null}}).sort({distance: req.query.sort}).limit(5).lean()

      for (const user of users){
        const rank = (await User.find({distance: {$gt: user.distance}}).countDocuments())+1
        leaderboard.push({...user, rank: rank})
      }

      if(req.query.sort == "asc"){
        leaderboard.reverse()
      }

      res.send(leaderboard).status(200)
      return
    } else if(req.query.sort == "you") {
      // If no email, reject... since we can't do anything without an email
      if(!req.session.email){
        res.sendStatus(401)
        return
      }

      const you = await User.findOne({email: req.session.email}).lean()

      // This should not happen, but in the case of the database not having an already logged in user
      // Also checked if there is a distance on record
      if(!you || !you.distance) {
        res.sendStatus(401)
        return
      }

      let leaderboard = []

      for(const user of (await User.find({distance: {$gt: you.distance}}).sort({distance: "asc"}).limit(2).lean()).reverse()){
        leaderboard.push({...user, rank: (await User.find({distance: {$gt: user.distance}}).countDocuments())+1})
      }

      leaderboard.push({...you, rank: (await User.find({distance: {$gt: you.distance}}).countDocuments())+1, you: true})

      for(const user of await User.find({distance: {$lt: you.distance}}).sort({distance: "desc"}).limit(2).lean()){
        leaderboard.push({...user, rank: (await User.find({distance: {$gt: user.distance}}).countDocuments())+1})
      }

      res.status(200).send(leaderboard)

    } else {
      res.sendStatus(422)
      return
    }
  })


module.exports = router;