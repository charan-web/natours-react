const express = require('express')
const bookingController = require('./../Controller/bookingController')
const authController = require('./../Controller/authController')
const bookingRoute = express.Router()



bookingRoute.get('/my-tours',authController.protect, bookingController.getMyTours)

bookingRoute.get('/checkout-session/:tourid',authController.protect,bookingController.getCheckoutSession)




module.exports = bookingRoute