/* jshint esversion: 9 */

const routes = require('express').Router();
const path = require('path');
const auth = require('../middleware/auth');
const config = require('config');

routes.get('/', auth, (req, res, next) => {
  return res.status(200).sendFile(path.join(__dirname, '../', 'public/dashboard/homepage.html'));
});

routes.get('/rooms', auth, (req, res, next) => {
  return res.status(200).sendFile(path.join(__dirname, '../', 'public/dashboard/rooms.html'));
});

module.exports = routes;