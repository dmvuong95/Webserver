const mongoose = require('mongoose');
const _ = require('lodash');
const async = require('async');

module.exports = function({model, methods}) {
  // Assign model for this controller
  this.model = model;

  // Init some default methods
  this.new = function ({data}, callback) {
    data._id = undefined;
    this.model.create(data, (err,result)=> {
      if (err) return callback(err);
      callback(null, {ok: true, data: this.model.getRawData(result)});
    });
  };
  this.edit = function ({data}, callback) {
    let updateData = _.clone(data);
    delete updateData._id;
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
    if (!data || !data._id) return callback(null, {ok: false, message: '_id is undefined'});
    this.model.findOne({_id: mongoose.Types.ObjectId(data._id)}, (err,result)=> {
      if (err) return callback(err);
      callback(null, {ok: true, data: this.model.getRawData(result)});
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
    async.parallel({
      data: (callback) => {
        this.model.find(query, fields).sort(sort).skip(skip).limit(limit).exec((err,result)=> {
          if (err) return callback(err);
          callback(err, result.map(r => this.model.getRawData(r)));
        });
      },
      total: (callback) => this.model.countDocuments(query, callback),
      ok: callback => callback(null, true)
    }, callback)
  };
  // Assign custom methods for this comtroller
  if (methods) {
    for (const name in methods) {
      this[name] = methods[name];
    }
  }
}