const express = require('express')
const { addUserAddress, fetchUserAddress, fetchUser } = require('../Controller/User')
const router = express.Router()

router
   .get('/', fetchUser)
   .get('/address', fetchUserAddress)
   .patch('/', addUserAddress)

module.exports = router