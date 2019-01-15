var express = require('express');

var router = express.Router();

// /* GET home page. */
router.get('/:ids', function(req, res) {
  let ids = JSON.parse(req.params.ids);
  console.log(ids);
  res.render('index', { valuation: {}, user: {} });
});

module.exports = router;
