/* jshint esversion: 9 */

const routes = require('express').Router();
const path = require('path');

routes.get('/', (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, '../', 'public/home/contactus.html'));
});

routes.post('/', (req, res) => {
  res.status(200).redirect('/contact');
});

module.exports = routes;