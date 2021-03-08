/* jshint esversion: 9 */

const routes = require('express').Router();
const path = require('path');
const user = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const passport = require('passport');

routes.get('/login', (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, '../', 'public/auth/login.html'));
});

routes.post('/login', async (req, res, next) => {
  let User = await user.findOne({ username: req.body.username });
  if(!User) return res.status(200).send({ message: 'User not found'});

  await bcrypt.compare(req.body.password, User.password, async (err, result) => {
    if(err) return res.status(500).send(err);
    if(!result) return res.status(403).send({ message: 'Password does not match'});

    let token = await jwt.sign({ username: User.username }, config.get('auth.jwt.key'), { expiresIn: 3600000 });
    res.cookie('authtoken', token, { maxAge: 3600000 });
    return res.status(200).redirect('/dashboard');
  });
});

routes.get('/register', (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, '../', 'public/auth/register.html'));
});

routes.post('/register', (req, res) => {
  bcrypt.genSalt(10, (err, salt) => {
    if(err) {
      console.log(err);
      return res.status(500).send('Unexpected error while attempting to save error.');
    }
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      if(err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }
      let User = new user({ email: req.body.email, username: req.body.username, password: hash });
      User.save();
      res.status(200);
      passport.authenticate('local')(req, res, function() { res.redirect('/auth/login'); });
    });
  });
});

routes.get('/logout', (req, res, next) => {
  if(req.cookies) {
    res.clearCookie('authtoken');
    return res.redirect('/auth/login');
  }
});

module.exports = routes;