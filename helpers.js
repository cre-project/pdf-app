const MAPS_KEY = process.env.GOOGLE_MAPS_API_KEY || ''

const googleMapsClient = require('@google/maps').createClient({
    key: MAPS_KEY,
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
  if (!MAPS_KEY) return Promise.resolve([pkg])

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

function addMapURLs(pkg) {
  if (!MAPS_KEY) return pkg

  let property = pkg.property[0]
  let rentComps = pkg.rented_units
  let salesComps = pkg.sold_properties

  if (property && property.lat && property.lng) {
    // generate static map URL, center map on property location & add pin for property
    let baseMapURL = `https://maps.googleapis.com/maps/api/staticmap?center=${property.lat},${property.lng}&zoom=13&maptype=roadmap&size=700x800&markers=color:red%7C${property.lat},${property.lng}`

    // Rent comps map: pin for property + pins of a different color for all rented units for this package 
    let rentCompMapURL = baseMapURL

    for (let i=0; i < rentComps.length; i++) {
      let comp = rentComps[i] 

      if (comp.lat && comp.lng) {
        rentCompMapURL += `&markers=color:blue%7Clabel:${i + 1}%7C${comp.lat},${comp.lng}`
      }
    }

    // Sales comps map: pin for property + pins of a different color for all sold properties for this package
    let salesCompMapURL = baseMapURL

    for (let i=0; i < salesComps.length; i++) {
      let comp = salesComps[i] 

      if (comp.lat && comp.lng) {
        salesCompMapURL += `&markers=color:blue%7Clabel:${i + 1}%7C${comp.lat},${comp.lng}`
      }
    }

    rentCompMapURL += `&key=${MAPS_KEY}`
    salesCompMapURL += `&key=${MAPS_KEY}`

    pkg.salesCompMapURL = salesCompMapURL 
    pkg.rentCompMapURL = rentCompMapURL 
    return pkg
  }
}

function calculateValues(pkg) {
  if (pkg.property_units) {
    pkg.property_units.forEach(unit => {
      unit.unitType = (unit.bedrooms && unit.bedrooms === 0 || !unit.bedrooms) ? 'Studio' : `${unit.bedrooms} bed`
    })
  }

  return pkg
}

module.exports = { calculateValues, addCoordinatesToPackage, getImageURLs, addMapURLs }