// Main application file

// Libs for handling requests
const express = require('express');
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);
const cors = require('cors');
const morgan = require('morgan')

// Libs for sending API requests (Google OAuth, Strava Profile)
const fetch = require('node-fetch');

// Libs for database querying, etc.
const mongoose = require('mongoose');

// Init mongoose connection
mongoose
	.connect(`${process.env.MONGO_PREFIX}${process.env.MONGO_URL}`, { 
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS,
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
	.then(() => {
    console.log("mongoose connected")
	})
  .catch((err) => {
    throw err // Just die if error has been caught here, no point continuing without a DB Connection
  })

// Instantiate express app
let app = express();

// Middleware
app.use(morgan('dev'))
app.use(express.json())

console.log("Client: ", process.env.CLIENT_URL)
app.use(cors({credentials: true, origin: process.env.CLIENT_URL}))

// Sessions
let sess = {
  secret: 'batterycowrulerz',
  cookie: {}
}

console.log(process.env)

if(process.env.NODE_ENV == 'production'){
  let store = new MongoDBStore({
    uri: `${process.env.MONGO_PREFIX}${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_URL}`,
    collection: 'sessions',
    connectionOptions: {
      useNewUrlParser: true, 
      useUnifiedTopology: true,
    }
  });

  sess.store = store
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}
 
app.use(session(sess))

// Routing

// Reject /
app.get('/', function(req, res) {
  res.status(418).redirect(process.env.CLIENT_URL)
})

// Import Routes
let apiRoutes = require('./routes/api_routes.js')
let adminRoutes = require('./routes/admin_routes.js')
let callbackRoutes = require('./routes/callback_routes.js')

// Use Routes
app.use("/api", apiRoutes)
app.use("/admin", adminRoutes)
app.use("/callback", callbackRoutes)

// catch undefined routes and respond with 404
app.use(function(req, res, next) {
  res.status(404).send("Can't find that!")
});

// catch server errors and respond with 500
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Oops, a 500 error!')
})

// Export this app for unit testing purposes
module.exports = app;

