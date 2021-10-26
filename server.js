const mongoose = require('mongoose')
const express = require('express')
const app = require('./app')  
const cors = require('cors') 
const dotenv = require('dotenv')
const morgan = require('morgan')
dotenv.config({path: './config.env'})
// const path = require('path')
app.options('*',cors())
app.use(morgan('common'))



process.on('uncaughtException',err=>{
    console.log(err.name, err.message)
   process.exit(1)
})
// console.log(process.env.PASSWORD)
const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.PASSWORD)

            




mongoose.connect(DB,{  
    useNewUrlParser:true,
    useUnifiedTopology:true              
            
     
}).then(()=>console.log("SUCCESFULLY CONECTED TO THE OWN DATABASE")).catch(err=>console.log(err)  )                  
  


const port =  process.env.PORT || 8080     
       
const server = app.listen(port,()=>{
    console.log(`app is listening on ${port}`)
})


process.on('uncaughtRejection',err=>{
    console.log(err.name, err.message)
    server.close(()=>{
        process.exit(1)
    })
})