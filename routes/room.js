/* jshint esversion: 9 */

const routes = require('express').Router();
const rooms = require('../models/Room');
const path = require('path');
const auth = require('../middleware/auth');

routes.get('/', (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, '../', 'public/home/rooms.html'));
});

routes.get('/create', auth, (req, res) => {
  return res.status(200).send('Use method POST');
});

routes.post('/create', async (req, res) => {
  if(await rooms.findOne({ number: req.body.number}) ) return res.status(200).send('Error: Room already exists');
  if(!req.body || typeof(req.body) != 'object') return res.status(200).send('Body must be type Object');
  if(!req.body.number) return res.status(200).send('Room number is a required field.');
  if(!req.body.type) return res.status(200).send('Room type is a required field.');
  if(!req.body.description) return res.status(200).send('Room Description is a required field');
  if(!req.body.vacant) req.body.vacant = true;
  if(!req.files) req.body.images = [];
  else {
    req.body.images = [];
    if(Array.isArray(req.files['files'])) {
      for(let file in req.files['files']) {
      
        let image = req.files['files'][file];
        image.mv(__dirname + `/../public/images/rooms/${req.files['files'][file].name}`);
        req.body.images.push(req.files['files'][file].name);
      }
    } else {
      req.files['files'].mv(__dirname + `/../public/images/rooms/${req.files['files'].name}`);
      req.body.images.push(req.files['files'].name);
    }
  }

  let room = new rooms(req.body);
  room.save()
   .then((data) => { return res.status(200).redirect('/dashboard/rooms'); })
   .catch((err) => {
     console.error(err);
     return res.status(500).send('Error while attempting to generate room');
   });
});

routes.get('/all', (req, res) => {
  rooms.find({}, async (err, rooms) => {
    if(err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
    return res.status(200).send(rooms);
  });
});

routes.get('/:id', (req, res) => {
  rooms.findOne({ number: req.params.id }, async (err, room) => {
    if(err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
    if(!room) return res.status(200).send('Room not found.');
    else return res.status(200).send(room);
  });
});

routes.post('/:id/update', auth, (req, res) => {
  if(!req.body || typeof(req.body) != 'object') return res.status(200).send('Body type must be an object');
  rooms.findOneAndUpdate({ number: req.params.id }, req.body, async (err, room) => {
    if(err) {
      console.error(err);
      return res.status(500).send('Error 500, Interal server error');
    }

    if(!room) return res.status(200).send(`Room: ${req.params.id} does not exist`);
    return res.status(200).redirect('/dashboard/rooms');
  });
});

routes.post('/:id/delete', auth, (req, res) => {
  rooms.findOneAndDelete({ number: req.params.id }, async (err, room) => {
    if(err) {
      console.error(err);
      return res.status(500).send('Error 500, Internal Server Error');
    }
    if(!room) return res.status(200).send(`Room: ${req.params.id} does not exist`);
    return res.status(200).redirect('/dashboard/rooms');
  });
});

module.exports = routes;