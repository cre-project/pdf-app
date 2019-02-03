let express = require('express')
let request = require('request')

let router = express.Router();

/** Env variables */
const API_URL = process.env.API_URL || 'http://localhost:3000/api';
const BACKEND_API_KEY = process.env.BACKEND_API_KEY || 'xxx';
const GOOGLE_MAPS_API = process.env.GOOGLE_API_MAPS_API
const googleMapsUrl = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API}&callback=initMap`

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

/** Helpers */
function getImageURLs (pkg) {
  let p = pkg && pkg['package'] ? pkg['package'] : {}

  let imageURLs = {
    'page-1': p.cover_image_url || '../../images/Untitled.jpg',
    'page-2': p.information_image_url || '../../images/Untitled_02.jpg',
    'page-6': p.property_photos_cover_image_url || '../../images/Untitled_05.jpg',
    'page-8': p.recent_sales_cover_image_url || '../../images/Untitled_07.jpg',
    'page-10': p.rent_comparables_cover_image_url || '../../images/Untitled.jpg',
    'page-12': p.pricing_cover_image_url || '../../images/Untitled_10.jpg', 
    'page-14': p.closing_cover_image_url || '../../images/Untitled_11.jpg',
    'page-17': p.property_information_cover_image_url || '../../images/Untitled_07.jpg',
    'photo-1': p.property_image_1 || '',
    'photo-2': p.property_image_2 || '',
    'photo-3': p.property_image_3 || '',
    'photo-4': p.property_image_4 || '',
    'side-img': p.table_of_contents_image_url || '../../images/Untitled_04.jpg',
    'side-img-2': p.property_information_image_url || '../../images/Untitled_04.jpg'
  }

  return imageURLs
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
      pkg = responseBody['package'];
      user = responseBody['user'];
      if (pkg && user) {
        res.render('index', { valuation: pkg, user: user, images: getImageURLs(pkg)});
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

router.get('*', function(res) {
  res.status(200)
})

module.exports = router
