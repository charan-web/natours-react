const mongoose = require('mongoose')


const bookingSchema = new mongoose.Schema({
    tour:{
        type:mongoose.Schema.ObjectId,
        ref:'Tour',
        required:[true,'A tour is required to book a tour']
    },
    user:{
        type:String,
        ref:'User',
        require:[true,'A user is required to book a tour']
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    paid:{
        type:Boolean,
        default:true
    }
})

bookingSchema.pre(/^find/,function(next){
    this.populate('user').populate({
        path:'tour',
        select:'name'
    })
    next()
})

const Booking = mongoose.model('Booking',bookingSchema)

module.exports = Booking