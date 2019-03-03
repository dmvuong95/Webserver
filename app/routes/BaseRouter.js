const express = require('express');
const _ = require('lodash');
const defaultMethods = ['new','edit','delete','get','getAll'];

const checkAuthenticate = (req,res,next) => {
  if (!req.session || !req.session.currentUser || !req.session.currentUser._id) return res.sendStatus(401);
  next();
}

module.exports = function ({name, controller, public}) {
  var router = express.Router();
  if (!public) router.use(checkAuthenticate);
  defaultMethods.forEach(method => {
    router.post('/'+method, (req,res)=> {
      var dataInput = _.cloneDeep(req.session);
      dataInput.data = req.body;
      console.log('before router', name, method, dataInput);
      controller[method](dataInput, (err,result)=> {
        console.log('after router', name, method, err, result);
        if (err) res.send({ok :false});
        res.json(result);
      })
    });
  })
  return router;
}