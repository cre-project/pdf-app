var express = require('express');
var router = express.Router();
var request = require('request');

const API_URL = process.env.API_URL || 'http://localhost:3000/api'
const BACKEND_API_KEY = process.env.BACKEND_API_KEY || 'xxx'

router.get('/:packageId', function(req, res) {
  
  const options = {
    url: `${API_URL}/packages/${req.params.packageId}/full_package`,
    headers: {
      'PDF_APP_API_KEY': BACKEND_API_KEY
    }
  }

  request.get(options, function(error, response, body) {
    if (!response.statusCode === 200 || error) {
      res.status(403).send('Package not found')
      return
    }

    try {
      let responseBody = JSON.parse(body);
      console.log('response body:', body)
      pkg = responseBody['package'];
      user = responseBody['user'];
      if (pkg && user) {
        res.render('index', { valuation: pkg, user: user });
      } else {
        res.status(403).send('Package not found')
      }
    } catch (e) {
      console.log('Error parsing response: ', e.message || e)
      res.status(403).send('Package not found')
    }
  });
});

module.exports = router;
