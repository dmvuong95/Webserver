const BaseCtr = require('./BaseCtr');
const User = require('../models/users');

const userCtr = new BaseCtr({
  model: User,
  methods: {
    getByUsername(dataInput, callback) {
      let data = dataInput.data;
      this.model.findOne({ username: data.username.toString() }, (err, result) => {
        if (err) return callback(err);
        if (!result) return callback(null, { ok: false, message: `Can't find username!` });
        if (result.password !== data.password.toString()) return callback(null, { ok: false, message: `Wrong password!` });
        result._id = result._id.toHexString();
        console.log('1444', result, typeof result._id, result._id.toString(), result._id.toHexString());
        result.password = undefined;
        console.log(result);
        callback(null, { ok: true, data: result });
      })
    },
    signUp(dataInput, callback) {
      
    }
  }
});

module.exports = userCtr;