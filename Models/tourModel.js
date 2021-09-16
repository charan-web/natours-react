const mongoose = require("mongoose")

const tourSchema = new mongoose.Schema({
    
    name:{
        type:String,
        required:[true,"A tour is required"],
        unique:true
    },
    duration:{
        type:Number,
        required:[true,"A duration is required"]
    },
    maxGroupSize:{
        type:Number,
        required:[true,'A tour must have a group size']
    },
    difficulty:{
       type:String,
       required:[true,"a tour must have a difficulty"] 
    },
    ratingsAverage:
    {
     type:Number,
     default:4.5,
     set: (val)=> Math.round(val * 10) / 10
    },
    ratingsQuantity:{
        type:Number,
        default:0
    },
    priceDiscount:Number,
    price:{  
        type:Number,
        required:true,
    },
    summary:{
        type:String,
        trim:true
    },
    description:{
        type:String,
        trim:true
    },
    imageCover:{
        type:String,
        required:[true,"A tour must have cover image"]
    },
    images:[String],
    createdAt:{
        type:Date,
        default:Date.now()
    },
    startDates:[Date],
    startLocation:{
        type:{
            type:String,
            default:"Point",
            enum:["Point"]
        },
        coordinates:[Number],
        address:String,
        description:String,
    },
    locations:[
    {
        type:{
            type:String,
            default:'Point',
            enum:['Point']
        },
        coordinates:[Number],
        address:String,
        description:String,
        day:Number
    }
    ],
    guides:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'User'
        }
    ],
    

},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
}
)
tourSchema.index({startLocation: '2dsphere'})

tourSchema.virtual('reviews',{
    ref:'Review',
    foreignField:'tour',
    localField:'_id'
})

// tourSchema.virtual('bookings',{
//     ref:'Booking',
//     foreignField:'tour',
//     localField:'_id'
// })


tourSchema.pre(/^find/,function(next){
    this.populate({
        path:'guides',
        select:'-__v -passwordChangedAt'
      })
      next()
})
const Tour = mongoose.model("Tour",tourSchema)

module.exports = Tour 