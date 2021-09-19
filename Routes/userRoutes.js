const express = require("express");

const userRouter = express.Router();
const userController = require("./../Controller/userController");
const authController = require("./../Controller/authController");   



 

userRouter.post("/signup", authController.signUp);
userRouter.post('/login',authController.login)
userRouter.get('/logout',authController.logout)
userRouter.route('/me').get(authController.protect,userController.getUser) 


userRouter.post('/forgotpassword',authController.forgotPassword)
userRouter.patch('/resetpassword/:id',authController.resetPassword)
userRouter.patch('/updatepassword',authController.protect,authController.updatePassword)
userRouter.patch('/updateme',authController.protect,userController.uploadPhoto,userController.resizePhoto,userController.updateMe) 




userRouter.get("/", userController.getAllUsers);  
userRouter.get("/:id",userController.getUser);


// userRouter.post("/update", userController.updateUser);
userRouter.delete("/deleteme",authController.protect, userController.deleteUser);


module.exports = userRouter;
