var express = require('express');
var router = express.Router();
var request = require('request');

const API_URL = process.env.API_URL || 'localhost:3000/api';

const fakePackage = {
  package: {
    package: {
      id: '95a8c232-d71c-41cb-b464-11e7048bbed1',
      template: 'bla',
      created_at: '2019-01-18T16:02:14.885Z',
      updated_at: '2019-01-18T16:02:14.885Z',
      user_id: '67b53cfd-2207-4cf6-a821-bae90278127e',
      image_urls: []
    },
    property: {
      id: '5350f836-d51a-401c-8bce-0eda7bbe9b8f',
      name: "Marion's House",
      year_built: 1999,
      number_of_stories: 3,
      lot_size: 2,
      apn: 'apn-123456',
      price: 34,
      total_square_feet: 70,
      created_at: '2019-01-19T23:39:57.380Z',
      updated_at: '2019-01-19T23:39:57.380Z',
      package_id: '95a8c232-d71c-41cb-b464-11e7048bbed1',
      user_id: '67b53cfd-2207-4cf6-a821-bae90278127e',
      address: {
        id: '0c06de7a-1658-45cf-be8c-8cf7f7a0c64b',
        street: '1990 Pennsylvania Avenue',
        city: 'Washington',
        state: 'DC',
        zip: 12345,
        created_at: '2019-01-19T23:39:57.524Z',
        updated_at: '2019-01-19T23:39:57.524Z'
      }
    },
    property_units: [
      {
        bedrooms: 1,
        bathrooms: 1,
        current_rent: 1290,
        potential_rent: 1900
      },
      {
        bedrooms: 2,
        bathrooms: 2,
        current_rent: 3000,
        potential_rent: 4000
      }
    ],
    package_sold_properties: [
      {
        id: '5d633f16-c1b7-49ad-a409-4bbfce5a94a6',
        created_at: '2019-01-19T23:57:10.766Z',
        updated_at: '2019-01-19T23:57:10.766Z',
        package_id: '95a8c232-d71c-41cb-b464-11e7048bbed1',
        sold_property_id: 'f68391bf-df92-4f4d-85cf-c50d1419b3d3',
        address: {
          id: '0c06de7a-1658-45cf-be8c-8cf7f7a0c64b',
          street: '1990 Pennsylvania Avenue',
          city: 'Washington',
          state: 'DC',
          zip: 12345,
          created_at: '2019-01-19T23:39:57.524Z',
          updated_at: '2019-01-19T23:39:57.524Z'
        }
      },
      {
        id: '5d633f16-c1b7-49ad-a409-4bbfce5a94a6',
        created_at: '2019-01-19T23:57:10.766Z',
        updated_at: '2019-01-19T23:57:10.766Z',
        package_id: '95a8c232-d71c-41cb-b464-11e7048bbed1',
        sold_property_id: 'f68391bf-df92-4f4d-85cf-c50d1419b3d3',
        address: {
          id: '0c06de7a-1658-45cf-be8c-8cf7f7a0c64b',
          street: '1910 Obama Avenue',
          city: 'Washington',
          state: 'DC',
          zip: 12345,
          created_at: '2019-01-19T23:39:57.524Z',
          updated_at: '2019-01-19T23:39:57.524Z'
        }
      },
      {
        id: '5d633f16-c1b7-49ad-a409-4bbfce5a94a6',
        created_at: '2019-01-19T23:57:10.766Z',
        updated_at: '2019-01-19T23:57:10.766Z',
        package_id: '95a8c232-d71c-41cb-b464-11e7048bbed1',
        sold_property_id: 'f68391bf-df92-4f4d-85cf-c50d1419b3d3',
        address: {
          id: '0c06de7a-1658-45cf-be8c-8cf7f7a0c64b',
          street: '1910 Obama Avenue',
          city: 'Washington',
          state: 'DC',
          zip: 12345,
          created_at: '2019-01-19T23:39:57.524Z',
          updated_at: '2019-01-19T23:39:57.524Z'
        }
      }
    ],
    package_rented_units: [
      {
        id: '5d633f16-c1b7-49ad-a409-4bbfce5a94a6',
        created_at: '2019-01-19T23:57:10.766Z',
        updated_at: '2019-01-19T23:57:10.766Z',
        package_id: '95a8c232-d71c-41cb-b464-11e7048bbed1',
        sold_property_id: 'f68391bf-df92-4f4d-85cf-c50d1419b3d3',
        address: {
          id: '0c06de7a-1658-45cf-be8c-8cf7f7a0c64b',
          street: '1990 Pennsylvania Avenue',
          city: 'Washington',
          state: 'DC',
          zip: 12345,
          created_at: '2019-01-19T23:39:57.524Z',
          updated_at: '2019-01-19T23:39:57.524Z'
        }
      },
      {
        id: '5d633f16-c1b7-49ad-a409-4bbfce5a94a6',
        created_at: '2019-01-19T23:57:10.766Z',
        updated_at: '2019-01-19T23:57:10.766Z',
        package_id: '95a8c232-d71c-41cb-b464-11e7048bbed1',
        sold_property_id: 'f68391bf-df92-4f4d-85cf-c50d1419b3d3',
        address: {
          id: '0c06de7a-1658-45cf-be8c-8cf7f7a0c64b',
          street: '1910 Obama Avenue',
          city: 'Washington',
          state: 'DC',
          zip: 12345,
          created_at: '2019-01-19T23:39:57.524Z',
          updated_at: '2019-01-19T23:39:57.524Z'
        }
      }
    ],
    operating_statement: [
      {
        id: '67cf4224-3f67-45b2-ad38-1b81a6dff0e8',
        created_at: '2019-01-18T22:45:22.768Z',
        updated_at: '2019-01-18T22:45:22.768Z',
        package_id: '95a8c232-d71c-41cb-b464-11e7048bbed1'
      }
    ]
  },
  user: {
    user: {
      id: '67b53cfd-2207-4cf6-a821-bae90278127e',
      first_name: 'Lukas',
      last_name: 'Elmer',
      email: 'lukas.elmer@gmail.com',
      license_number: null,
      phone_number: null,
      title: null,
      subscription_expiration: null,
      fax: null,
      created_at: '2019-01-18T15:21:19.844Z',
      updated_at: '2019-01-18T15:21:19.844Z',
      password_digest:
        '$2a$10$IJ785pUVUTsFi4Hx4hwgD.ml5nPlFB0uxbioDOmbgC/vSyrgHVEY6',
      picture_url: null,
      reset_password_token: null,
      reset_password_sent_at: null,
      pabbly_customer_id: null,
      subscription: null,
      company_id: null
    },
    company: {
      name: 'Marion Inc.',
      website: 'https://marioninc.com',
      logo_url: 'https://marioninc.com/logo'
    },
    addresses: []
  }
};

router.get('/:packageId', function(req, res) {
  const pkg = fakePackage['package'];
  const user = fakePackage['user'];

  console.log(pkg.package_sold_properties.address);
  console.log(pkg.package_sold_properties.close_of_escrow);

  res.render('index', { valuation: pkg, user: user });
  // const url = `${API_URL}/packages/${req.params.packageId}`

  // request(url, function(body) {
  //   try {
  //     let responseBody = JSON.parse(body);
  //     pkg = responseBody['package'];
  //     user = responseBody['user'];
  //     if (pkg && user) {
  //       res.render('index', { valuation: pkg, user: user });
  //     } else {
  //       res.status(403).send('Package not found')
  //     }
  //   } catch (e) {
  //     console.log('Error parsing response: ', e.message || e)
  //     res.status(403).send('Package not found')
  //   }
  // });
});

module.exports = router;
