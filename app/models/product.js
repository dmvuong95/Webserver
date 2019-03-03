const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new mongoose.model('products', new Schema({
  name: String,
  buyCost: Number,
  saleCost: Number,
  remainQuantity: Number
}, {versionKey: false}));

module.exports = User;