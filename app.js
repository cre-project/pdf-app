const express = require('express');
const path = require('path');
const logger = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const frameguard = require('frameguard');
const nunjucks = require('nunjucks');
const accounting = require('accounting-js')

var indexRouter = require('./routes/index');

var app = express();

// set http headers
app.use(helmet());
// allow showing site in iframe from the cre-dashboard
app.use(
  frameguard({
    action: 'allow-from',
    domain: process.env.DASHBOARD_URL || 'http://localhost:8080'
  })
);
app.use(compression());
app.use(logger('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


// templating
let env = nunjucks.configure('public', {
  autoescape: true,
  express: app
});
env.addFilter('money', function(value) {
  return accounting.formatMoney(value, { precision: 0 })
});


app.set('view engine', 'html');

app.use('/', indexRouter);

module.exports = app;
