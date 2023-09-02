const express = require('express')
const { addToCart, fetchCartItems, deleteCartItem, updateCartItem } = require('../Controller/Cart')
const router = express.Router()

router
   .post('/', addToCart)
   .get('/', fetchCartItems)
   .delete('/', deleteCartItem)
   .patch('/', updateCartItem)

module.exports = router