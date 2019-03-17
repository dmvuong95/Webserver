const app = require('../');
const BaseCtr = require('./BaseCtr');
const Product = require('../models/product');

app.filterMethod({
  before(err, info, dataInput, result, callback, breakCallback) {
    console.log('before GlobalCtr', err, info, dataInput, result);
    callback(err, dataInput, result);
  },
  after(err, info, dataInput, result, callback, breakCallback) {
    console.log('after GlobalCtr', err, info, dataInput, result);
    callback(err, dataInput, result);
  }
});
app.filterMethod('productCtr', {
  before(err, info, dataInput, result, callback, breakCallback) {
    console.log('before productCtr', err, info, dataInput, result);
    callback(err, dataInput, result);
    // breakCallback(null, {ok: false, message: 'Test breakCallback'})
  },
  after(err, info, dataInput, result, callback, breakCallback) {
    console.log('after productCtr', err, info, dataInput, result);
    callback(err, dataInput, result);
  }
});
app.filterMethod('productCtr', 'new', {
  before(err, info, dataInput, result, callback, breakCallback) {
    console.log('before productCtr newww', err, info, dataInput, result);
    // breakCallback(err, {ok: false, message: 'Test breakCallback'});
    callback(err, dataInput, result);
  },
  after(err, info, dataInput, result, callback, breakCallback) {
    console.log('after productCtr newww', err, info, dataInput, result);
    callback(err, dataInput, result);
  }
});

const productCtr = new BaseCtr({
  name: 'productCtr',
  model: Product,
  methods: {}
});

module.exports = productCtr;