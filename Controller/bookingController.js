const dotenv = require('dotenv') 
dotenv.config({path: './config.env'})

const stripe=require('stripe')(process.env.STRIPE_KEY)
const Tour = require('./../Models/tourModel')
const User = require('./../Models/userModel')
const catchAsync = require('./../Utilities/catch')
const AppError = require('./../Utilities/APIclass')
const Booking = require('./../Models/bookingModel')

exports.getCheckoutSession = catchAsync(async(req,res,next)=>{
    //* 1 Get the tour id from params

    const tour = await Tour.findById(req.params.tourid)


    //* 2 create check-out session

    const session = await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        success_url:`${req.protocol}://${req.get('host')}/booking/my-tours/`,
        cancel_url:`${req.protocol}://${req.get('host')}/`,
        customer_email:req.user.email,
        client_reference_id:req.params.tourid,
        line_items:[
            {
                name:`${tour.name} Tour`,
                description:tour.summary,
                images:[`https://www.natours.dev/img/tours/${tour.imageCover}`],
                amount:tour.price * 100 * 73,
                currency:'inr',
                quantity:1
            }
        ]

    })
    res.status(200).json({
        status:'success',
        session
    })

    //* 3 send the session as response
})

const bookingCheckout=async (session)=>{
    const tour = session.client_reference_id 
    const user = (await User.findOne({email:session. customer_email})).id
    const price = session.display_items[0].amount / 100 
    await Booking.create({tour,user,price})

}

exports.bookingSession= catchAsync(async (req,res,next)=>{
    // // //! This is a temporary solution
   
    // const {tour,user,price} = req.query

    // if(!tour && !user && !price) return next()
    // await Booking.create({tour,user,price})

    // res.redirect(req.originalUrl.split('?')[0])
    const signature = req.headers['stripe-signature']
    let event 
    try {
        event = stripe.webhooks.contructEvent(
            req.body,
            signature,
            process.env.STRIPE_SECRET_KEY
        )
    } catch (error) {
        return res.status(400).send('webHook error'+ error.message)
    }
    if(event ==='checkout.session.completed'){
        bookingCheckout(event.data.object)
    }

    res.status(200).json({received:true})

})


exports.getMyTours = catchAsync(async(req,res,next)=>{
    
    const books = await Booking.find({user:req.user.id})
  
     if(!books) {
         return res.status(200).json({
             status:"success",
             message:"No tours Booked yet"
         })
     }
    const tourIds = books.map(tour => tour.tour)

    const tour = await Tour.find({_id:{$in:tourIds}})

    res.status(200).json({
        status:"success",
        tour

    })

})