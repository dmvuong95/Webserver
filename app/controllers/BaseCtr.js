const mongoose = require('mongoose');
const _ = require('lodash');
const async = require('async');
const app = require('../');

module.exports = class BaseCtr {
  constructor ({name, model, methods}) {
    // Assign model for this controller
    this.model = model;
    // Init some default methods
    this.new = async function (dataInput, callback) {
      try {
        var global = await hookBefore(name, 'new', null, dataInput);
        let data = global.gDataInput.data;
        data._id = undefined;
        this.model.create(data, async (err,result) => {
          global.gError = err; global.gResult = {ok: true, data: this.model.getRawData(result)};
          try {
            await hookAfter(name, 'new', global);
            if (global.gError) return callback(global.gError);
            callback(null, global.gResult);
          } catch (error) {
            callback(error.error, error.result)
          }
        });
      } catch (error) {
        callback(error.error, error.result)
      }
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
}

function hookBefore(controllerName, methodName, gError, gDataInput, gResult) {
  return new Promise(async (resolve, reject) => {
    var global = {gError, gDataInput, gResult};
    try {
      // Global controller filter
      if (app.filterStore[`before-GlobalCtr`]) {
        await new Promise((resolve, reject) => {
          app.filterStore[`before-GlobalCtr`](global.gError, {controller: controllerName, method: methodName}, global.gDataInput, global.gResult, 
            (error, dataInput, result) => {
              global.gError = error; global.gDataInput = dataInput, global.gResult = result; resolve();
            },
            (error, result) => reject({error,result})
          )
        });
      }
      // Controller filter
      if (app.filterStore[`before-${controllerName}`]) {
        await new Promise((resolve, reject) => {
          app.filterStore[`before-${controllerName}`](global.gError, {controller: controllerName, method: methodName}, global.gDataInput, global.gResult, 
            (error, dataInput, result) => {
              global.gError = error; global.gDataInput = dataInput, global.gResult = result; resolve();
            },
            (error, result) => reject({error,result})
          )
        });
      }
      // Method filter
      if (app.filterStore[`before-${controllerName}-${methodName}`]) {
        await new Promise((resolve, reject) => {
          app.filterStore[`before-${controllerName}-${methodName}`](global.gError, {controller: controllerName, method: methodName}, global.gDataInput, global.gResult, 
            (error, dataInput, result) => {
              global.gError = error; global.gDataInput = dataInput, global.gResult = result; resolve();
            },
            (error, result) => reject({error,result})
          )
        });
      }
      resolve(global)
    } catch (error) {
      reject(error)
    }
  });
}

function hookAfter(controllerName, methodName, global) {
  return new Promise(async (resolve, reject) => {
    try {
      // Method filter
      if (app.filterStore[`after-${controllerName}-${methodName}`]) {
        await new Promise((resolve, reject) => {
          app.filterStore[`after-${controllerName}-${methodName}`](global.gError, {controller: controllerName, method: methodName}, global.gDataInput, global.gResult, 
            (error, dataInput, result) => {
              global.gError = error; global.gDataInput = dataInput, global.gResult = result; resolve();
            },
            (error, result) => reject({error,result})
          )
        });
      }
      // Controller filter
      if (app.filterStore[`after-${controllerName}`]) {
        await new Promise((resolve, reject) => {
          app.filterStore[`after-${controllerName}`](global.gError, {controller: controllerName, method: methodName}, global.gDataInput, global.gResult, 
            (error, dataInput, result) => {
              global.gError = error; global.gDataInput = dataInput, global.gResult = result; resolve();
            },
            (error, result) => reject({error,result})
          )
        });
      }
      // Global controller filter
      if (app.filterStore[`after-GlobalCtr`]) {
        await new Promise((resolve, reject) => {
          app.filterStore[`after-GlobalCtr`](global.gError, {controller: controllerName, method: methodName}, global.gDataInput, global.gResult, 
            (error, dataInput, result) => {
              global.gError = error; global.gDataInput = dataInput, global.gResult = result; resolve();
            },
            (error, result) => reject({error,result})
          )
        });
      }
      resolve(global)
    } catch (error) {
      reject(error)
    }
  });
}
