const googleMapsClient = require('@google/maps').createClient({
    key: process.env.GOOGLE_MAPS_API_KEY || ''
})


function getCoordinatesForAddress(address) {
    // Geocode an address.
  googleMapsClient.geocode({
    address: address
  }, function(err, response) {
    if (!err) {
      console.log(response.json.results);
    }
  })
}


function initMap() {
    
    let myLatLng = { lat: 37.423123, lng: -122.084010 };

    // this map has a pin for property + pins of a different color for all sold properties for this package (get latlng for each address) 
    let recentSalesMap = new google.maps.Map(document.getElementById('map'), {
        center: myLatLng,
        zoom: 14
    });
    new google.maps.Marker({
        map: recentSalesMap,
        position: myLatLng,
        title: 'Hello World!'
    })

    // this map has a pin for property + pins of a different color for all rented units for this package (get latlng for each address) 
    let rentComparableMap = new google.maps.Map(document.getElementById('mapTwo'), {
        center: myLatLng,
        zoom: 14
    })

    new google.maps.Marker({
        map: rentComparableMap,
        position: myLatLng,
        title: 'Hello World!'
    })
}