function initMap () {
    const pathParts = window.location.href.split('/')
    const packageID = pathParts[pathParts.length - 1]

    let req = new XMLHttpRequest()
    req.open('GET', `http://localhost:4000/api/${packageID}`, true)
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    req.onreadystatechange = function (e) {
        if (req.readyState === 4 && req.status === 200) {
            let pkg = JSON.parse(req.response)
            let property = pkg.property[0]
            let propertyTitle = property && property.address && property.address.full ? property.address.full : 'Property'
            let rentComps = pkg.rented_units
            let salesComps = pkg.sold_properties

            // this map has a pin for property + pins of a different color for all rented units for this package 
            if (property && property.lat && property.lng) {
                let rentComparableMap = new google.maps.Map(document.getElementById('mapTwo'), {
                    center: { lat: property.lat, lng: property.lng },
                    zoom: 14
                })

                // marker for the property
                new google.maps.Marker({
                    map: rentComparableMap,
                    position: { lat: property.lat, lng: property.lng },
                    title: propertyTitle
                })

                // TODO add full address
                for (let i=0; i < rentComps.length; i++) {
                    let unit = rentComps[i] 

                    if (unit.lat && unit.lng) {
                        new google.maps.Marker({
                            map: rentComparableMap,
                            position: { lat: unit.lat, lng: unit.lng },
                            label: i,
                            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                            title: unit.address && unit.address.full ? unit.address.full : 'Rent Comparable'
                        })
                    }
                }

                // this map has a pin for property + pins of a different color for all sold properties for this package
                let salesComparableMap = new google.maps.Map(document.getElementById('map'), {
                    center: { lat: property.lat, lng: property.lng },
                    zoom: 14
                })

                // marker for the property
                new google.maps.Marker({
                    map: salesComparableMap,
                    position: { lat: property.lat, lng: property.lng },
                    title: propertyTitle
                })

                // TODO add full address
                for (let i=0; i < salesComps.length; i++) {
                    let comp = salesComps[i] 

                    if (comp.lat && comp.lng) {
                        new google.maps.Marker({
                            map: salesComparableMap,
                            position: { lat: comp.lat, lng: comp.lng },
                            label: i,
                            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                            title: comp.address && comp.address.full ? comp.address.full : 'Sales Comparable'
                        })
                    }
                }
            }
        } else if (req.readyState === 4 && req.status !== 200) {
            console.log('Package not found', req.statusText)
        }
    }
    req.send()
}
