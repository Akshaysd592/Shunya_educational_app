
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import { asyncHandler } from '../utility/asyncHandler.js';
import { ApiError } from '../utility/ApiError.js';
import {User} from '../models/User.model.js'

dotenv.config({
    path:'./.env'
}
)


//  algo for middleware auth
// function is used to authenticate the user request
export const auth = asyncHandler(async(req,res,next)=>{
// trycatch 
// getting token from cookies  , body, header
    const token = 
                req.cookies.token ||
                req.body.token ||
                req.header("Authorization").replace("Bearer ","");
// no token return error
  if(!token){
    throw new ApiError(401,"Token is missing");
  }
// trycatch verify token using jwt.verify using token obtained and .env jwt secret
try {
    const decode = await jwt.verify(token,process.env.JWT_SECRET);
    if(!decode){
      throw new ApiError(401,"Something went Wrong while validation the token")
    }
    console.log("Token decoded in auth middleware ", decode)
    req.user = decode;// store value in req.user
} catch (error) { // return error if occured
    throw new ApiError(401,"Token is invalid")// if error then token invalid message
}

next(); //next() to make next function working in middleware
})


//Middleware to check the student or not, if not then return error else send to next()
// isStudent name
// get userdetail using email
// check for accountType 

export const isStudent = asyncHandler(async(req,res,next)=>{
     const {email} = req.user.email;
     const userDetails = await User.findOne({email});

     if(userDetails.accountType !== "Student"){
      throw new ApiError(400,"This is a protected route for Student only..")
     }
     next();
})

// similarly for Instructor and admin check
export const isInstructor = asyncHandler(async(req,res,next)=>{
      const {email} = req.user.email; 
      // find the user details using email
      const userDetails = await User.findOne({email});
      if(userDetails.accountType !== "Instructor"){
        throw new ApiError(400,"This is a protected route for Instructor only.. ")
      }
      // else send to next function working using next()
      next();
})

// similarly for Admin also 
export const isAdmin = asyncHandler(async (req,res,next)=>{
  const {email} = req.user.email;
  // find details of user using email
  const userDetails = await User.findOne({email});
  if(userDetails.accountType !== "Admin"){
    throw new ApiError(400,"This is an protected route for Admin only..")
  }
  // else send to the next()
  next();
})