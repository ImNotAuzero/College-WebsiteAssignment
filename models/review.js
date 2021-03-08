/* jshint esversion: 9 */

const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  username: String,
  email: String,
  review: String,
  rating: Number
});

module.exports = mongoose.model('reviews', ReviewSchema);