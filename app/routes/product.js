const BaseRouter = require('./BaseRouter');
const productCtr = require('../controllers/productCtr');

var router = BaseRouter({
  name: 'product',
  controller: productCtr,
  public: false
});

module.exports = router;