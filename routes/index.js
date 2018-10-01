var express = require('express');
var firebase = require('firebase')

var router = express.Router();

var app = firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_DOMAIN,
  databaseURL: process.env.FIREBASE_DB_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_DB_URL,
  messagingSenderId: process.env.FIREBASE_SENDER_ID
});

const firestore = firebase.firestore()
const settings = {timestampsInSnapshots: true}
firestore.settings(settings)

function fetchVal(valuationID) {
  return firebase.firestore().collection('valuations').doc(valuationID).get().then(doc => {
    if (!doc.exists) {
      console.log('No such document')
    } else {
      return doc.data()
    }
  }).catch(err => {
    console.log('Error getting documents', err)
  })
}

function fetchUser(userId) {
  return firebase.firestore().collection('users').doc(userId).get().then(doc => {
    if (!doc.exists) {
      console.log('No such document')
    } else {
      return doc.data()
    }
  }).catch(err => {
    console.log('Error getting documents', err)
  })
}

// /* GET home page. */
router.get('/:ids', function(req, res) {
  let ids = JSON.parse(req.params.ids)
  console.log(ids)
  if (ids.valuationId === '' || ids.userId === '') {
    res.render('index', {valuation: {}, user: {}})
  } else {
    fetchVal(ids.valuationId).then(valuation => {
        console.log(ids.valuationId)
        fetchUser(ids.userId).then(user => {
          console.log(valuation)
          res.render('index', { valuation: valuation, user: user })
        })
      }).catch(e => res.render('index', {valuation: {}, user: {}}))
    }
});

module.exports = router;
