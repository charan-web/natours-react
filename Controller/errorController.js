 //! Handling MongoDB Errors

   const handleCastErrDB=(err,next)=>{
       return new AppError("Tour id does not match",400)
   }
  
   const handleDupDB = (err)=>{
       return new AppError("Duplicate values",400)
   }
  
   const handleValidErrDB = (err) =>{
       const error = Object.values(err.errors).map(el=>el.message)
       const message = `Invalid input ${error.join('. ')}`
       return new AppError(message,400)
   }

   const handleJToken = ()=>{
       return new AppError("no token",401)
   }
   
   const handleTokenError = ()=>{
       return new AppError("Token expired, Please log in again",401)
   }
 
 
 
 
 
 //! Errors in Development
  const sendErrDev = (err,res)=>{
    res.status(err.statusCode).json({
        status:err.status,
        message:err.message,
        stack:err.stack 
        
    })
   }
//! Errors in Production
   const sendErrProd = (err,res)=>{
       //! operational errors in productions
        if(err.isOperational){
            res.status(err.statusCode).json({
                status:err.status,
                message:err.message,
           
           })
        }else{
       //! unknown programming errors in production
            res.status(500).json({
                status:"error",
                message:"something went wrong"
            })
        }
}
module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500
    err.status = err.status || "error"
    
 
   if(process.env.NODE_ENV = "development"){
       console.log("dev")
        sendErrDev(err,res)
   }else if(process.env.NODE_ENV = "production"){
       let error = {...err}
       console.log("pro")
       if(error.name==="CastError") error = handleCastErrDB(error)
       if(error.code===11000) error = handleDupDB(error)
       if(error.name === "ValidationError") error = handleValidErrDB(error)
       if(error.name==="JsonWebTokenError") error = handleJToken()
       if(error.name==="TokenExpiredError") error = handleTokenError()
        sendErrProd(error,res)
       
   }
 }