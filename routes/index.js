var express = require('express');
var router = express.Router();
var request = require('request');

// /* GET home page. */
// router.get('/:ids', function(req, res) {
// // let ids = JSON.parse(req.params.ids);
// console.log(ids);
// res.render('index', { valuation: {}, user: {} });
// });

router.get('/:packageId', function(req, res) {
  const url = `http://localhost:8080/api/packages/${req.params.packageId}`

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
