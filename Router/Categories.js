const express = require('express')
const { fetchAllCategories } = require('../Controller/Categories')
const router = express.Router()

router
   .get("/", fetchAllCategories)

module.exports = router