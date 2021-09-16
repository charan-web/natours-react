const mongoose = require('mongoose')
const fs = require('fs')
const Tour = require('./Models/tourModel')
const User = require('./Models/userModel')
const dotenv = require('dotenv')
const Review = require('./Models/reviewModel')

dotenv.config({path: "./config.env"})


// const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.PASSWORD)
const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.PASSWORD)
console.log(DB)
mongoose.connect(DB,{
    useUnifiedTopology:true,
    useNewUrlParser:true,
   
}).then((con)=>console.log("SUCCESFULLY CONECTED TO THE DATABASE")).catch(err=>console.log(err))


const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,"utf-8"))
const users  = JSON.parse(fs.readFileSync(`${__dirname}/users.json`,"utf-8"))
const rev = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`,"utf-8"))


const createAllTours = async(req,res)=>{
    try{
        await Tour.create(tours)
        await User.create(users,{validateBeforeSave:false})
        await Review.create(rev)
        console.log("data is created")
        process.exit()
        
    }catch(err){
        console.log(err)
    }
}
const deleteAll = async(req,res)=>{
    try{
        await Tour.deleteMany()
        await User.deleteMany()
        await Review.deleteMany()
        console.log(
            "Deleted all data"
        )
        process.exit()
       
    }catch(err){
        console.log(err)
    }
}
if(process.argv[2]=== "--import"){
    createAllTours()
}else if(process.argv[2]==="--delete"){
    deleteAll()
}

console.log(process.argv)

