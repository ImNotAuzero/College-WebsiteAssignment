/* jshint esversion: 9 */

const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  number: { type: Number, unique: true, required: true },
  type: String, // Kingsize etc.
  description: String, // Description about the room
  vactant: Boolean, // Occupied room?
  images: Array, // Multiple images of the room
  price: String // Store as a string rather than Number (Mongo will convert anyways)
});

module.exports = mongoose.model('rooms', RoomSchema);