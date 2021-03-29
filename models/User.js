/* jshint esversion: 9 */

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean }
});

module.exports = mongoose.model('users', UserSchema);