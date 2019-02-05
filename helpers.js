const googleMapsClient = require('@google/maps').createClient({
    key: process.env.GOOGLE_MAPS_API_KEY || '',
    Promise: Promise
})

function getCoordinatesForAddress(address) {
  console.log('geocoding', address)
  // Geocode an address.
  return googleMapsClient.geocode({ address: address}).asPromise()
    .then((response) => {
      let res = response.json.results[0]
      if (res && res.geometry) {
          let location = res.geometry.location
          console.log('location: ', address, location)
          return location ? Promise.resolve({ lat: location.lat, lng: location.lng }) : Promise.resolve({})
      }
      return Promise.resolve({})
    })
    .catch((err) => {
      console.log('err:', err)
      return Promise.reject(err)
    })
}

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

async function addCoordinates(items) {
  return Promise.all(items.map(async item => {
    let address = item.address
    let data = await getCoordinatesForAddress(`${address.street || ''}, ${address.city || ''}, ${address.zip || ''} ${address.state || ''}`)
    if (data && data.lat && data.lng) {
      item.lat = data.lat
      item.lng = data.lng
    }
    return item
  }))
}

async function addCoordinatesToPackage(pkg) {
  try {
    if (pkg.property && pkg.property.address) {
        pkg.property = await addCoordinates([pkg.property])
    }
    // add coordinates to rent comps
    if (pkg.rented_units) { 
        pkg.rented_units = await addCoordinates(pkg.rented_units)
    }
    // // add coordinates to sales comps
    if (pkg.sold_properties) { 
        pkg.sold_properties = await addCoordinates(pkg.sold_properties)
    }
  } catch (e) {
      console.log('Couldn\'t add coordinates: ', e)
  }
  
  return Promise.resolve(pkg)
}

module.exports = { addCoordinatesToPackage, getImageURLs }