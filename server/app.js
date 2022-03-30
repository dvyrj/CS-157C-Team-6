var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cassandra = require('cassandra-driver');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

let contactPoints = ['127.0.0.1'];
let localDataCenter = 'datacenter1';
let keyspace = 'team6';
let client = new cassandra.Client({contactPoints: contactPoints, localDataCenter: localDataCenter, keyspace: keyspace});

app.get('/apple', (req, res) => {
  var first_name = [];
  var last_name = [];
  var query = `SELECT * FROM account`;
  client.execute(query).then(result => {
    for (let i = 0; i < result.rowLength; i++) {
      first_name.push(result.rows[i].first_name);
      last_name.push(result.rows[i].last_name);
    }
  }).catch((error) => console.log('ERROR: ', error)).then(
    () => { res.json({ "first_name" : first_name, "last_name" : last_name }); });

})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
