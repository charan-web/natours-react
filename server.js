const mongoose = require('mongoose')
const express = require('express')
const app = require('./app')   
const dotenv = require('dotenv') 
dotenv.config({path: './config.env'})
const path = require('path')


// console.log(process.env.PASSWORD)
const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.PASSWORD)

            




mongoose.connect(DB,{  
    useNewUrlParser:true,
    useUnifiedTopology:true              
            
     
}).then(()=>console.log("SUCCESFULLY CONECTED TO THE OWN DATABASE")).catch(err=>console.log(err)  )                  
  


 

const port =  process.env.PORT || 8080     
       
app.listen(port,()=>{
    console.log(`app is listening on ${port}`)
})   
             