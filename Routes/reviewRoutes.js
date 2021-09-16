const express = require('express')

const reviewController = require('./../Controller/reviewController')

const authController = require('./../Controller/authController')

const reviewRouter = express.Router({mergeParams:true})


reviewRouter.route('/').get(reviewController.getAllReviews).post(authController.protect, reviewController.createReview)










module.exports = reviewRouter