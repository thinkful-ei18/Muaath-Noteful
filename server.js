'use strict';

const data = require('./db/notes');
const {PORT} = require('./config.js');
const {logger} = require('./middleware');
const simDB = require('./db/simDB');
const notes = simDB.initialize(data);

console.log(simDB);

const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(logger);

app.get('/v1/notes', (req, res, next) => {
  // const searchNotes = val => (val.title.includes(searchTerm) || val.content.includes(searchTerm));
  let { searchTerm } = req.query;
  // return (!searchTerm) ? res.json(data) : res.json(data.filter(searchNotes)); 
  notes.filter(searchTerm, (err, list) => {
    if (err) {
      return next(err);
    }
    res.json(list);
  });
});

app.get('/v1/notes/:id', (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  // res.json(data.find(item => item.id === id));
  notes.find(id, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      res.json('not found');
    }
  });
});

app.put('/v1/notes/:id', (req, res, next) => {
  const id = req.params.id;
  const updateObj = {};
  const updateFields = ['title', 'content'];

  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  notes.update(id, updateObj, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      next();
    }
  });
});

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
