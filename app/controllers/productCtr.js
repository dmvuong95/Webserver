const BaseCtr = require('./BaseCtr');
const Product = require('../models/product');

const userCtr = new BaseCtr({
  model: Product,
  methods: {}
});

module.exports = userCtr;