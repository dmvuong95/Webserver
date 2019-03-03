const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

const indexRouter = require('./app/routes/index');
const usersRouter = require('./app/routes/users');
const importRouters = require('./app/importRouters');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(session({secret: 'dhIHHiHIhnniUHiHi', cookie: {maxAge: 24*3600000}}))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.get('/*', (req,res)=> {
  let redirectLink = ('/#'+req.originalUrl).replace(/\/{2,}/g,'/')
  res.redirect(redirectLink)
})
app.use('/users', usersRouter);
importRouters.forEach(tableName => {
  app.use('/'+tableName, require('./app/routes/'+tableName));
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
