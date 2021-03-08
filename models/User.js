/* jshint esversion: 9 */

const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('users', UserSchema);