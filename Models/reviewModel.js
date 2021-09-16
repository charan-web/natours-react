const mongoose = require('mongoose')
const User = require('./../Models/userModel')


const reviewSchema = new mongoose.Schema({
    review:{
        type:String,
    },
    tour:{
        type:mongoose.Schema.ObjectId,
        ref:'Tour',
        required:[true,"Review must belong to a tour"]
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,"Only a User post a tour"]
    },
    rating:{
        type:Number,
        min:1,
        max:5,
        default:4.5
    },
    createdAt:{
        type:Date,
        defaut:Date.now
    }
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

reviewSchema.pre(/^find/,function(next){
    this.populate({
        path:'user',
        select:'name photo'
    })
    next()
})

reviewSchema.statics.calcStats=async function(tourId){
    const stats = await this.aggregation([
        {
            $match:{tour:tourId}
        },
        {
            $group:{
                _id:'tour',
                nRating:{$sum:1},
                avgRating:{$avg:'$rating'}
            }
        }
    ])

   if(!stats[0]){
    await Tour.findByIdAndUpdate(tourId,{
        ratingsAverage:stats[0].avgRating,
        ratingsQuantity:stats[0].nRating
    })
   }else{
    await Tour.findByIdAndUpdate(tourId,{
        ratingsAverage:4.5,
        ratingsQuantity:0
    })
   }
}

//* creating the new review
reviewSchema.pre('save',function(next){
    this.contructor.calcStats(this.tour) 
    next()
    
})

//* update the ratings on update and delete ratings
//* 1. find the current document
reviewSchema.pre(/^findById/,function(next){
    this.r = this.findOne()
    next()

})
//* 2. 
reviewSchema.post(/^findById/,async function(){
    await this.r.contructor.calcStats(this.r.tour)

})


const Review = mongoose.model('Review',reviewSchema)

module.exports = Review