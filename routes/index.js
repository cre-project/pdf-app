let express = require('express')
let request = require('request')
let helpers = require('./../helpers.js')

let router = express.Router();

/** Env variables */
const API_URL = process.env.API_URL || 'http://localhost:3000/api';
const BACKEND_API_KEY = process.env.BACKEND_API_KEY || 'xxx';
const GOOGLE_MAPS_API = process.env.GOOGLE_API_MAPS_API

/** Mapping image IDS -> DB columns */
const IMAGE_IDS = {
  'page-1': 'cover_image_url',
  'page-2': 'information_image_url',
  'page-6': 'property_photos_cover_image_url',
  'page-8': 'recent_sales_cover_image_url',
  'page-10': 'rent_comparables_cover_image_url',
  'page-12': 'pricing_cover_image_url',
  'page-14': 'closing_cover_image_url',
  'page-17': 'property_information_cover_image_url',
  'photo-1': 'property_image_1',
  'photo-2': 'property_image_2',
  'photo-3': 'property_image_3',
  'photo-4': 'property_image_4',
  'side-img': 'table_of_contents_image_url',
  'side-img-2': 'property_information_image_url'
}


/**
 * ROUTES
 */
router.get('/:packageId', function(req, res) {
  const options = {
    url: `${API_URL}/packages/${req.params.packageId}/full_package`,
    headers: {
      PDF_APP_API_KEY: BACKEND_API_KEY
    }
  }

  request.get(options, function(error, response, body) {
    if (error || !response || response.statusCode !== 200) {
      res.status(403).send('Package not found')
      return
    }

    try {
      let responseBody = JSON.parse(body);
      pkg = responseBody['package']
      user = responseBody['user']

      if (pkg && user) {
        res.render('index', { valuation: pkg, user: user, images: helpers.getImageURLs(pkg)});
      } else {
        res.status(403).send('Package not found');
      }
    } catch (e) {
      console.log('Error parsing response: ', e.message || e);
      res.status(403).send('Package not found');
    }
  });
});

router.post('/api/saveImage', function (req, res) {
  const { packageID, imageID, url } = req.body
  let body = { package: {}}
  body.package[IMAGE_IDS[imageID]] = url

  const options = {
    url: `${API_URL}/packages/${packageID}`,
    headers: {
      PDF_APP_API_KEY: BACKEND_API_KEY,
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body: JSON.stringify(body)
  }

  request.put(options, function (error, response, body) {
    if (error || !response || response.statusCode !== 200) {
      res.status(500).send('Image could not be saved')
      return
    }
    res.status(200).send('Image saved')
  })
})

router.get('/api/:id', function (req, res) {
  console.log('REQUEST 1')
  const options = {
    url: `${API_URL}/packages/${req.params.id}/full_package`,
    headers: {
      PDF_APP_API_KEY: BACKEND_API_KEY
    }
  }

  request.get(options, function(error, response, body) {
    console.log('REQUEST')
    if (error || !response || response.statusCode !== 200) {
      res.status(403).send('Package not found')
      return
    }

    try {
      let responseBody = JSON.parse(body);
      pkg = responseBody['package']

      if (pkg) {
        helpers.addCoordinatesToPackage(pkg).then(pkg => {
          res.status(200).send(pkg)
        }).catch((e) => {
          console.log(e)
          res.status(403).send('Package not found');
        })
      } else {
        res.status(403).send('Package not found');
      }
    } catch (e) {
      console.log('Error parsing response: ', e.message || e);
      res.status(403).send('Package not found');
    }
  });
})

router.get('*', function(res) {
  res.status(200)
})

module.exports = router
