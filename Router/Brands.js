const express = require('express')
const { fetchAllBrands } = require('../Controller/Brands')
const router = express.Router()

router
   .get("/", fetchAllBrands)

module.exports = router