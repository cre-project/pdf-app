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
  let id = JSON.parse(req.params.packageId);
  console.log(id);

  let url = 'http://localhost:8080/api/packages/' + id['packageId'];
  console.log(url);

  request(url, function(error, response, body) {
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);
    console.log('body:', body);
  });
});

module.exports = router;
