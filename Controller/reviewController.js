const Review = require('./../Models/reviewModel')

const catchAsync = require('./../Utilities/catch')


exports.createReview = catchAsync(async(req,res,next)=>{
    if(!req.body.tour) req.body.tour = req.params.id
    if(!req.body.user) req.body.user = req.user._id
    const review = await Review.create(req.body)

    res.status(200).json({
        status:"success",
        data:{
            review
        }
    })
})

exports.getAllReviews = catchAsync(async(req,res,next)=>{
    let filter = {}
    if(req.params.id) filter={tour:req.params.id}
     const reviews = await Review.find(filter)
    res.status(200).json({
        status:"success",
        result:reviews.length,
        reviews
    })
})