const BaseCtr = require('./BaseCtr');
const User = require('../models/users');
const _ = require('lodash');

const userCtr = new BaseCtr({
  model: User,
  methods: {
    getByUsername(dataInput, callback) {
      let data = dataInput.data;
      this.model.findOne({ username: data.username.toString() }, (err, result) => {
        if (err) return callback(err);
        if (!result) return callback(null, { ok: false, message: `Can't find username!` });
        if (result.password !== data.password.toString()) return callback(null, { ok: false, message: `Wrong password!` });
        let rawData = this.model.getRawData(result);
        delete rawData.password;
        callback(null, { ok: true, data: rawData });
      })
    },
    signUp(dataInput, callback) {
      
    }
  }
});

module.exports = userCtr;