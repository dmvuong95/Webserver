const mongoose = require('mongoose');
const _ = require('lodash');

module.exports = function({model, methods}) {
  // Assign model for this controller
  this.model = model;

  // Init some default methods
  this.new = function ({data}, callback) {
    data._id = undefined;
    this.model.create(data, (err,result)=> {
      if (err) return callback(err);
      result._id = result._id.toHexString();
      callback(null, {ok: true, data: result});
    });
  };
  this.edit = function ({data}, callback) {
    let updateData = _.cloneDeep(data);
    updateData._id = undefined;
    this.model.updateOne({_id: mongoose.Types.ObjectId(data._id)}, updateData, (err,result)=> {
      if (err) return callback(err);
      callback(null, {ok: true, data: result});
    });
  };
  this.delete = function ({data}, callback) {
    if (!data || !data._id) return callback(null, {ok: false, message: '_id is undefined'});
    this.model.deleteOne({_id: mongoose.Types.ObjectId(data._id)}, (err,result)=> {
      if (err) return callback(err);
      callback(null, {ok: true, data: result});
    })
  }
  this.get = function ({data}, callback) {
    this.model.findOne({_id: mongoose.Types.ObjectId(data._id)}, (err,result)=> {
      if (err) return callback(err);
      result._id = result._id.toHexString();
      callback(null, {ok: true, data: result});
    });
  };
  this.getAll = function ({data}, callback) {
    // data = {
    //   query: {},
    //   sort: {}
    //   skip: 0,
    //   limit: 10,
    //   fields: 'name',
    // };
    let query = data && data.query ? data.query : {};
    let fields = data && data.fields ? data.fields : undefined;
    let sort = data && data.sort ? data.sort : {};
    let skip = data && !isNaN(data.skip) && Number(data.skip) >= 0 ? Number(data.skip) : 0;
    let limit = data && !isNaN(data.limit) && Number(data.limit) > 0 ? Number(data.limit) : undefined;
    this.model.find(query, fields).sort(sort).skip(skip).limit(limit).exec((err,result)=> {
      if (err) return callback(err);
      result.forEach(record => {
        record._id = record._id.toHexString();
      });
      callback(null, {ok: true, data: result});
    });
  };
  // Assign custom methods for this comtroller
  if (methods) {
    for (const name in methods) {
      this[name] = methods[name];
    }
  }
}