const express = require('express')
const globalError = require('./Controller/errorController')
const AppError = require("./Utilities/APIclass")
const rateLimiter = require('express-rate-limit')
const morgan = require('morgan')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const path = require('path')
const cors = require('cors')
const compression = require('compression')
const bookingController = require('./Controller/bookingController')
const bodyParser = require('body-parser')
const app = express()

// app.use(cors())
app.use(cors());
app.use(morgan('common'))
 
// server.js or app.js




// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// }); 




app.post('/webhook-checkout',bodyParser.raw({type:'application/json'}),bookingController.bookingSession)

app.use(express.json({limit:'10kb'}))
app.use(express.urlencoded({extended:true,limit:'10kb'}))

app.use(mongoSanitize())

app.use(xss())

app.use(hpp())

//* Rate-Limiter

const limiter = rateLimiter({
    max: 150,
    windowMs:60 * 60 *1000,
    message:"Too many requests from this user. Please try again"
})

app.use('/',limiter)
app.use(helmet({ contentSecurityPolicy: (process.env.NODE_ENV === 'production') ? undefined : false }));


app.use(compression())

//* Routes
const tourRouter = require("./Routes/tourRoutes")
const userRouter = require('./Routes/userRoutes')
const reviewRouter = require('./Routes/reviewRoutes')
const bookingRouter = require('./Routes/bookingRoutes')



//* Routes Middleware
app.use("/tour", tourRouter)
app.use('/user',userRouter)
app.use('/review',reviewRouter)
app.use('/booking',bookingRouter)
if(process.env.NODE_ENV = "production"){
    app.use(express.static('Views/build'))
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'Views','build','index.html'))

    })
}           
 
 

app.all("*",(req,res,next)=>{
    const err = new Error("cant find the path")
     
    next(new AppError("cant find the path",404))
})

app.use(globalError)



module.exports = app