var express = require('express');
var router = express.Router();
var request = require('request');

const API_URL = process.env.API_URL || 'localhost:8080/api'

router.get('/:packageId', function (req, res) {  
  const url = `${API_URL}/packages/${req.params.packageId}`

  request(url, function(body) {
    try {
      let responseBody = JSON.parse(body);
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
