const express = require('express');
const path = require('path');
const logger = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const frameguard = require('frameguard');
const nunjucks = require('nunjucks');
var cors = require('cors')

var indexRouter = require('./routes/index');

var app = express();

// set up CORS
// allow requests from the same domain (pdf app) & from the dashboard
const whitelist = [ process.env.DASHBOARD_URL, 'http://localhost:8080', process.env.PDF_APP_URL, 'http://localhost:4000' ]
let corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors(corsOptions))

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
nunjucks.configure('public', {
  autoescape: true,
  express: app
});
app.set('view engine', 'html');

app.use('/', indexRouter);

module.exports = app;
