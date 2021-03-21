/* jshint esversion: 9 */

const routes = require('express').Router();
const reviews = require('../models/Review');
const path = require('path');

routes.get('/', (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, '../', '/public/home/reviews.html'));
});

routes.get('/create', (req, res) => {
  return res.status(200).send('Use method POST');
});

routes.post('/create', async (req, res) => {
  if(!req.body || typeof(req.body) != 'object') return res.status(200).send('Body must be type Object');
  if(!req.body.review) return res.status(200).send('Review Description is a required field');
  if(!req.body.name) return res.status(200).send('Review Name is a required field');
  if(!req.body.email) return res.status(200).send('Review Email is a required field');

  let review = new reviews(req.body);
  req.body.id = String.fromCharCode(10 + Math.floor(Math.random()) * 10);
  review.save()
   .then((data) => { return res.status(200).redirect('/reviews'); })
   .catch((err) => {
     console.error(err);
     return res.status(500).send('Error while attempting to generate review');
   });
});

routes.get('/all', (req, res) => {
  reviews.find({}, async (err, reviews) => {
    if(err) {
      console.error(err);
      return res.status(500).send('Internal server error');
    }
    return res.status(200).send(reviews);
  });
});

routes.get('/:id', (req, res) => {
  reviews.findOne({ id: req.params.id }, async (err, review) => {
    if(err) {
      console.error(err);
      return res.status(500).send('Internal server error');
    }
    if(!review) return res.status(200).send('Review not found.');
    else return res.status(200).send(review);
  });
});

module.exports = routes;