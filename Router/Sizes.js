const express = require('express')
const { fetchAllSizes } = require('../Controller/Sizes')
const router = express.Router()

router
   .get("/", fetchAllSizes)

module.exports = router