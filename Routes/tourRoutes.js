const express = require("express")
const  tourController = require("./../Controller/tourController") 
const tourRouter = express.Router() 
const authController = require('./../Controller/authController')
const reviewController = require('./../Controller/reviewController')
const reviewRouter = require("./reviewRoutes")
const bookingController = require('./../Controller/bookingController')






tourRouter.use('/:id/reviews',reviewRouter)

tourRouter.route("/").get(tourController.getAllTours).post(tourController.createTour)


//! remove protect route
tourRouter.route("/:id").get(tourController.getTour).post(tourController.updateTour).delete(tourController.deleteTour)


tourRouter.get('/topcheaptours',tourController.topCheapTours,tourController.getAllTours)

tourRouter.route('tours-within/:distance/center/:latlng/unit/:unit').get(tourController.geoWithIn)


 

module.exports = tourRouter

