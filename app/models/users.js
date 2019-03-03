const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = {
  username: String,
  password: String,
  fullname: String,
  createTime: Number
};
const User = new mongoose.model('users', new Schema(schema, {versionKey: false}));

User.getRawData = function (data) {
  let res = {_id: JSON.stringify(data._id).replace(/\"/g,'')};
  for (const key in schema) {
    if (key != '_id') res[key] = data[key];
  }
  return res;
}

module.exports = User;