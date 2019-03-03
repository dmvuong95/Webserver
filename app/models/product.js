const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = {
  name: String,
  buyCost: Number,
  saleCost: Number,
  remainQuantity: Number
};

const Product = new mongoose.model('products', new Schema(schema, {versionKey: false}));

Product.getRawData = function (data) {
  let res = {_id: JSON.stringify(data._id).replace(/\"/g,'')};
  for (const key in schema) {
    if (key != '_id') res[key] = data[key];
  }
  return res;
}

module.exports = Product;