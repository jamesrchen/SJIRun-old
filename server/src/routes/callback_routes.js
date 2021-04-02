const express = require('express'),
    router = express.Router();
const fetch = require('node-fetch')

// Models
const User = require('../models/user_model')

router
  // Handles Google OAuth Callback and stores data in sessions
  // /callback/google
  .get('/google', async (req, res) => {
    // If no code supplied, reject callback and return 422
    if(!req.query.code) {
      res.sendStatus(422)
      return
    }

    const code = req.query.code

    // Exchange code for token (POST)
    const tokenReqRaw = await fetch (
      `https://www.googleapis.com/oauth2/v3/token`+
      `?code=${code}`+
      `&client_secret=${process.env.GOOGLE_CLIENT_SECRET}`+
      `&client_id=${process.env.GOOGLE_CLIENT_ID}`+
      `&grant_type=authorization_code`+
      `&redirect_uri=${process.env.SERVER_URL}/callback/google`,
      {
        method: 'POST',
      }
    )

    const tokenReqJson = await tokenReqRaw.json()
    
    const scopes = tokenReqJson.scope.split(' ')

    if(tokenReqJson.error){
      res.status(422).send(tokenReqJson.error)
      return
    }

    if(!(scopes.includes('https://www.googleapis.com/auth/userinfo.email') && scopes.includes('https://www.googleapis.com/auth/userinfo.profile'))){
      res.status(422).send("Requires userinfo.email and userinfo.profile scopes, only ["+scopes.join(', ')+"] supplied")
      return
    }

    const accessToken = tokenReqJson.access_token

    // Fetch User Information (GET)
    const userinfoRaw = await fetch(
      "https://www.googleapis.com/oauth2/v1/userinfo",  
      {
        headers: {
        'Authorization': 'Bearer '+accessToken, 
        }
      }
    )

    const userInfoJson = await userinfoRaw.json()

    const email = userInfoJson.email
    let classroom = null
    let fullName = ""


    // Distinguish between (SJI) student email and any other email
    const isStudentEmail = (/^\w[(FN)(LE)(MN)(ML)]\d{3}2021$/).test(userInfoJson.given_name)

    if(isStudentEmail){
      classroom = userInfoJson.given_name // This is technically their firstname, but SJI uses this as a class id
      fullName = userInfoJson.family_name // This is technically their surname, but SJI uses this as their fullName
    } else {
      fullName = userInfoJson.given_name + " " + userInfoJson.family_name
    }

    console.log({
      email: email,
      fullName: fullName,
      classroom: classroom
    })

    console.log(userInfoJson)

    // Set session "email" field, this will be our main identifier
    req.session.email = email
    res.redirect(`${process.env.CLIENT_URL}/#google-success`)

    // Push to DB

    User.findOneAndUpdate({email: email}, {
      email: email,
      full_name: fullName,
      classroom: classroom,
    }, {upsert: true}).exec()

  })
  
  // Checks if Google auth has already been obtained, if not reject
  // Otherwise process Strava OAuth and update data
  // James: Just an fyi, I'm limited to 100 requests/15 minutes or 1000/day so I have no intention to store my token since I will never read it again
  // /callback/strava
  .get('/strava', async (req, res) => {
    if(!req.session.email){
      res.sendStatus(401)
      return
    }

    // If no code supplied, reject callback and return 422
    if(!req.query.code){
      res.sendStatus(422)
      return
    }

    // Send authorization request (fetch token)
    const authorizationRaw = await fetch(
      `https://www.strava.com/oauth/token`+
      `?code=${req.query.code}`+
      `&client_id=${process.env.STRAVA_CLIENT_ID}`+
      `&client_secret=${process.env.STRAVA_CLIENT_SECRET}`+
      `&grant_type=authorization_code`,
      {method: 'post'}
    )

    const authorizationJson = await authorizationRaw.json()

    if(authorizationJson.errors){
      res.redirect(`${process.env.CLIENT_URL}`)
      return
    }

    if(!authorizationJson.athlete){
      res.status(422).send("Could not read athlete data, insufficient scopes supplied?")
      return
    }

    // Get my bearer token
    let accessToken = authorizationJson.access_token

    // TODO: I can set the time period as well, also add more than 200 check!
    // This only queries the first 200 activities
    const activitiesRaw = await fetch(`https://www.strava.com/api/v3/athlete/activities?page=1&per_page=200`, 
      {
        headers: {
        'Authorization': 'Bearer '+accessToken, 
        }
      }
    )

    const activitiesJson = await activitiesRaw.json()

    // Apparently fetching the token does not tell me what my scopes are, if I cannot access activities it will just send an error
    if(activitiesJson.errors) {
      res.status(422).json(activitiesJson.errors)
      return
    }

    console.log(authorizationJson)

    const stravaID = authorizationJson.athlete.id

    let totalDistance = 0
    activitiesJson.forEach(activity => {
      // Reject if less than 1000 or activity is NOT Run or Walk
      if((activity.type == "Run" || activity.type == "Walk") && activity.distance > 1000) totalDistance += activity.distance
    });
    
    res.redirect(`${process.env.CLIENT_URL}/#strava-success`)

    // Now update DB

    // Update document with same email with new data
    User.findOneAndUpdate({email: req.session.email}, {
      strava_id: stravaID,
      distance: totalDistance
    }, {upsert: true}).exec()


  })

module.exports = router;