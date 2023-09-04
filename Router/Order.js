const express = require('express')
const { createOrder, fetchOrdersByUser, updateOrder, deleteOrder, fetchAllOrders, createOrderEmail } = require('../Controller/Order')
const router = express.Router()

router
    .post("/", createOrder)
    .get("/", fetchOrdersByUser)
    .get("/admin/orders", fetchAllOrders)
    .patch("/", updateOrder)
    .delete("/", deleteOrder)
    .post("/createorderemail", createOrderEmail)

module.exports = router