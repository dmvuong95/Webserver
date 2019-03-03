const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new mongoose.model('users', new Schema({
  username: String,
  password: String,
  fullname: String,
  createTime: Number
}, {versionKey: false}));

module.exports = User;