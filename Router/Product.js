const express = require('express')
const router = express.Router()
const { createProduct, fetchAllProductsByFilter, fetchProductById, updateProduct, deleteProduct } = require('../Controller/Product')


router
    .get('/', fetchAllProductsByFilter)
    .get('/:id', fetchProductById)
    .post('/', createProduct)
    .patch('/', updateProduct)
    .delete('/', deleteProduct)

module.exports = router