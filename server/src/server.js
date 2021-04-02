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

// Load environmental variables from .env if not in production (otherwise provided)
if(process.env.NODE_ENV != 'production'){
  console.log("Running in dev mode")
  const result = require('dotenv').config({
    path: ('../.env.local')
  })
  
  Object.keys(process.env).forEach((key) => {
    if (key.startsWith(`VITE_`)) {
      process.env[key.slice(5)] = process.env[key]
    }
  })

  if (result.error) {
    throw result.error
  }
}

// Instantiate express app
let app = express();

// Middleware
app.use(morgan('dev'))
app.use(express.json())

console.log("Client: ", process.env.CLIENT_URL)
app.use(cors({credentials: true, origin: process.env.CLIENT_URL}))

var store = new MongoDBStore({
  uri: `${process.env.MONGO_PREFIX}${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_URL}`,
  collection: 'sessions',
  connectionOptions: {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
  }
});

var sess = {
  secret: 'batterycowrulerz',
  cookie: {},
  store: store,
}
 
if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}
 
app.use(session(sess))

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

// Init database connection, then start listening on port
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
    app.listen(8000 || process.env.PORT, () => {
      console.log(`Listening on port ${8000 || process.env.PORT}`)
    });
	})
  .catch((err) => {
    throw err // Just die if error has been caught here, no point continuing without a DB Connection
  })
