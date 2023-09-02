const express = require('express')
const { createOrder, fetchOrdersByUser, updateOrder, deleteOrder, fetchAllOrders } = require('../Controller/Order')
const router = express.Router()

router
    .post("/", createOrder)
    .get("/", fetchOrdersByUser)
    .get("/admin/orders", fetchAllOrders)
    .patch("/", updateOrder)
    .delete("/", deleteOrder)

module.exports = router