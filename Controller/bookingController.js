const dotenv = require('dotenv') 
dotenv.config({path: './config.env'})

const stripe=require('stripe')(process.env.STRIPE_SECRET_KEY)
console.log("stripe key:"+process.env.STRIPE_SECRER_KEY)
const Tour = require('./../Models/tourModel')
const User = require('./../Models/userModel')
// const catchAsync = require('./../Utilities/catch')
const AppError = require('./../Utilities/APIclass')
const Booking = require('./../Models/bookingModel')
const catchAsync = (fn) =>{
    return (req,res,next)=>{
        fn(req,res,next).catch(err=>next(err))
    }
} 

exports.getCheckoutSession = catchAsync(async(req,res,next)=>{
    //* 1 Get the tour id from params
    console.log('booking')
    const tour = await Tour.findById(req.params.tourid)

    
    //* 2 create check-out session

    const session = await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        success_url:`https://dreamy-shaw-9ac27c.netlify.app/my-tours`,
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

exports.bookingCheckout=async (session)=>{
    try{
        console.log(session)
        const tour = session.client_reference_id 
        const user = (await User.findOne({email:session.customer_email})).id
        const price = session.data.object.amount_total  / 100 
        await Booking.create({tour,user,price})
        console.log("created a book tour")
       
    }catch(err){
        console.log(err)
    }
   

}
  // const {tour,user,price} = req.query

    // if(!tour && !user && !price) return next()
    // await Booking.create({tour,user,price})

    // res.redirect(req.originalUrl.split('?')[0])
    // const signature = req.headers['stripe-signature']

// exports.bookingSession=  (req,res,next)=>{
//     let event 
    // try {
    //     event = stripe.webhooks.constructEvent(
    //         req.body,
    //         req.headers['stripe-signature'],
    //         process.env.STRIPE_KEY
    //     )
    // } catch (error) {
    //     return res.status(400).send('webHook error'+ error.message)
    // }
    // if(event.type ==='checkout.session.completed'){
    //     console.log('payment success')
//         bookingCheckout(event.data.object)
//     }

//     res.status(200).json({received:true})

// }


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