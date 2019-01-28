var express = require('express');
var router = express.Router();
var request = require('request');

const API_URL = process.env.API_URL || 'http://localhost:3000/api';
const BACKEND_API_KEY = process.env.BACKEND_API_KEY || 'xxx';
const GOOGLE_MAPS_API = process.env.GOOGLE_API_MAPS_API
const googleMapsUrl = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API}&callback=initMap`

router.get('/:packageId', function(req, res) {
  const options = {
    url: `${API_URL}/packages/${req.params.packageId}/full_package`,
    headers: {
      PDF_APP_API_KEY: BACKEND_API_KEY
    }
  }

  request.get(options, function(error, response, body) {
    if (!response.statusCode === 200 || error) {
      res.status(403).send('Package not found')
      return
    }

    try {
      let responseBody = JSON.parse(body);
      pkg = responseBody['package'];
      user = responseBody['user'];
      console.log(process.env.GOOGLE_MAPS_API_KEY)
      if (pkg && user) {
        res.render('index', { valuation: pkg, user: user });
      } else {
        res.status(403).send('Package not found');
      }
    } catch (e) {
      console.log('Error parsing response: ', e.message || e);
      res.status(403).send('Package not found');
    }
  });
});

module.exports = router;
