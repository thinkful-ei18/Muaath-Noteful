'use strict';

const express = require('express');
const router = express.Router();

const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);

router.get('/notes', (req, res, next) => {
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
  
router.get('/notes/:id', (req, res, next) => {
  const id = parseInt(req.params.id, 10);
    // res.json(data.find(item => item.id === id));
  // notes.find(id, (err, item) => {
  //   if (err) {
  //     return next(err);
  //   }
  //   if (item) {
  //     res.json(item);
  //   } else {
  //     res.json('not found');
  //   }
  // });

  notes.find(id).then(item =>{
    if(item) {
      res.json(item);
    }
    else{
      next();
    }
  })
  .catch(err => next(err));
});
  
router.put('/notes/:id', (req, res, next) => {
  const id = req.params.id;
  const updateObj = {};
  const updateFields = ['title', 'content'];
  
  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
    // notes.update(id, updateObj, (err, item) => {
    //   if (err) {
    //     return next(err);
    //   }
    //   if (item) {
    //     res.json(item);
    //   } else {
    //     next();
    //   }
    // });
    notes.update(id, updateObj).then(item =>{
      if(item){
        res.json(item);
      }
      else{
        next();
      }
    }).catch(err => next(err));
  });
});

router.post('/notes', (req, res, next) => {
  const { title, content } = req.body;   
  const newItem = { title, content };
        /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }
      
  // notes.create(newItem, (err, item) => {
  //   if (err) {
  //     return next(err);
  //   }
  //   if (item) {
  //     res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
  //   } else {
  //     next();
  //   }
  // });
  notes.create(newItem).then(item => {
    if (item){
      res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
    } else{
      next();
    }
  }).catch(err => next(err));
});

router.delete('/notes/:id', (req,res,next) => {
  const id = req.params.id;
  // notes.delete(id, (err, res_note) => {
  //   if(err){
  //     return next(err);
  //   }
  //   res.send('delete success');
  // });
  notes.delete(id).then(item => {
    if(item){
      res.send('delete success');
    }
    next();
  }).catch(err => next(err));
});




module.exports = router;