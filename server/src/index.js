// This file runs app.js, allows for easier unit testing

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

const app = require('./app');
const debug = require('debug')('example:server');

const port = parseInt(process.env.PORT || '8000', 10);
app.set('port', port);

app.listen(app.get('port'), function () {
  debug(`Express server listening on port ${app.get('port')}`);
});