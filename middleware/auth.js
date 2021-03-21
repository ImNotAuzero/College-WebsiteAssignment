/* jshint esversion: 9 */

/**
 * Middleware file that checks if the user is authenticated to user specific endpoints.
 * If authenticated:
 *    grant access
 * else:
 *    deny access
 */

const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req, res, next) {
  const cookie = req.cookies.authtoken;
  if(!cookie) {
    if(req.headers['user-agent'].toLowerCase().includes('postman')) return res.status(403).send({ auth: false, message: 'Unauthorized'});
    return res.status(403).redirect('/auth/login');
  }

  jwt.verify(cookie, config.get('auth.jwt.key'), (err, decoded) => {
    if(err) return res.status(500).send({ message: 'Internal Server Error'});
    req.username = decoded.username;
    next();
  });
}

module.exports = auth;