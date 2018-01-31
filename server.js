'use strict';

const data = require('./db/notes');
const {logger} = require('./middleware');
const simDB = require('./db/simDB');
const notes = simDB.initialize(data);

console.log(simDB);

const express = require('express');
const app = express();
const morgan = require('morgan');
const notesRouter = require('./router/notes.router');

const { PORT } = require('./config');

// Log all requests
app.use(morgan('dev'));

// Create a static webserver
app.use(express.static('public'));
app.use(express.json());
app.use(logger);
app.use('/v1', notesRouter);

app.get('/boom', (req, res, next) => {
  throw new Error('Boom!!');
});
// app.post('/v1/notes/', (req, res) => {

// });


app.use(function (req, res, next) {
  let err = new Error ('Not Found');
  err.status = 404;
  res.status(404).json({message: 'Not Found' });
});

app.use(function (err, req, res, next){
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

app.listen(PORT, () => console.log('server working'));
// INSERT EXPRESS APP CODE HERE...

// Next you'll create Express Middleware to log the request. Hint, we suggest you first create the middleware in the server.js file. Then, once it is working, then move the middleware to a module. To confirm it is working, restart your app and make a few requests to the GET /v1/notes endpoint. Each request should be logged to the console, something like this:
