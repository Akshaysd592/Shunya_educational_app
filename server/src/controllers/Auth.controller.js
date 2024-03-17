import {asyncHandler} from '../utility/asyncHandler.js';
import {ApiError} from '../utility/ApiError.js';
import {ApiResponse} from '../utility/ApiResponse.js';
import {User} from '../models/User.model.js'
import {OTP}  from '../models/OTP.model.js'
import bcrypt from 'bcrypt';
import {Profile} from '../models/Profile.model.js'
import jwt from 'jsonwebtoken'
import otpGenerator from 'otp-generator'
import {mailSender}  from '../utility/mailSender.js'
import dotenv from 'dotenv'
import {passwordUpdated} from '../mail/templates/passwordUpdate.js'

dotenv.config({
   path:'./.env'
})



const signup = asyncHandler(async(req,res)=>{
     // destructuring data fields from req body
    const {
        firstName, 
        lastName,
        email, 
        password,
        confirmpassword,
        accountType,
        contactNumber, 
        otp,
    } = req.body;

     //validation 
     if([firstName,lastName,email,password,confirmpassword,accountType,contactNumber,otp].some((field)=>(field.trime() === ""))){
        throw new ApiError(403,"All fields are required");
     }
     // password and confirmpassword check 
     if(password !== confirmpassword){
        throw new ApiError(400,"Password and Confirmpassword not matched")
     }
     // check if user already exist
     const existinguser = await User.findOne({email})

     if(existinguser){
        throw new ApiError(400,"User already exist, Please sign in to continue");
     }
     // otp find and then check size and check otp obtained and otp available sort in decreasing order and then get last created otp
     const otpChecked = await OTP.find({email}).sort({createdAt:-1}).limit(1);
     console.log(otpChecked);
     //validation of otp
     if(otpChecked.length === 0){
        throw new ApiError(400,"The OTP is not valid")
     }
     else if(otpChecked[0].otp !== otp){ // database otp and userside otp not matched 
        throw new ApiError(400,"The OTP is not a valid otp") // invalid otp 
     }

     // hashpassword
     const hashedPassword = await bcrypt.hash(password,10);


     // create user approved
     let approved = ""
     (approved === "Instructor") ? (approved = false): (approved = true)
     // add additional profile details null 
    const profileUpdate = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber : null,
    })
     // create user 
     const usercreated = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password:hashedPassword,
      accountType,
      approved : approved,
      additionalDetails: profileUpdate._id,
      image:"",
     })
     // if ! user created then throw error
     if(!usercreated){
      throw new ApiError(500,"User can not be created , Please try again later")
     } 
     // return success response 
     return res.status(200).json(
      new ApiResponse(200,usercreated,"User registered successfully..")
     )

})



// login controller for authentication of user 
const login = asyncHandler(async(req,res)=>{
     // algorithm 
     // get data from req.body
     const {email, password} = req.body;
     // check data obtaied or not
     if(!email || !password){
      throw new ApiError(401, "All fields are required");
     }
     // user find using email
     const user = await User.findOne({email});
     // check user exist if not return error
     if(!user){
      throw new ApiError(500,"User does not exists, Please signup first");
     } 
     //  if condition jwt.compare(password)with user password
     if(await bcrypt.compare(password,user.password)){ // if true then create jwt token
               // create jwt token
         const token = jwt.sign(
            {email:user.email, id:user._id, role: user.role},// payload
            process.env.JWT_SECRET,
            {
               expiresIn:"24h",
            }
         )

         // remove value of password 
          user.token  = token ;
          user.password = undefined;

          //// then create cookie with options 
          const options = {
            expires: new Date(Date.now() + 3 * 24 *  60 * 60 * 1000),
            httpOnly: true,
          }
         
          // return cookies with response 
          return res.cookie("token",token,options).status(200).json(
            new ApiResponse(200, "User login success")
          )
     } 
     else{
      // throw error if password not matched
      throw new ApiError(400, "Password is incorrect,  check it again ")
     } 
})


// OTP is send when user is signup 

const sendotp = asyncHandler(async(req,res)=>{
   // get email from req.body
   const {email} = req.body;

   // check user already exist because otp is generated for new user only
   const existingUser = await User.findOne({email});

   if(existingUser){
      throw new ApiError(400,"User already exists , Login to continue..")
   }

   // create otp useing otpgenerator
   const otp = otpGenerator.generate(6,{
      upperCaseAlphabets:false,
      lowerCaseAlphabets:false,
      specialChars:false,
   })

   // check otp already exist using Otp model
   const result = await OTP.findOne({otp:otp})
   console.log("Result generated in otp generator ");
   console.log("Otp : ", result);
   // while loop to check otp get until now exist
   while(result){
      result =  otpGenerator.generate(6,{
         upperCaseAlphabets:false,
         lowerCaseAlphabets:false,
         specialChars:false,
      })
   }
 // database entry to be used when signup
   const otpplayload = {email, otp};
   const otpBody = await OTP.create(otpplayload);
   // return response success
      return res.status(200).json(
         new ApiResponse(200,otp, "OTP sent successfully")
      )
})

const  changePassword = asyncHandler(async(req,res)=>{
    

// algorithm for changepassword
// get id from req.user from middleware
const userDetails = await User.findById(req.user.id);
if(!userDetails){
   throw new ApiError(400,"Can not change password ");
} 

// get old and new password 
const {oldPassword, newPassword} = req.body;

// check old password using bcrypt compare function
const checkPassword = await bcrypt.compare(oldPassword,userDetails?.password);
//  if not password matched return success false
if(!checkPassword){
   throw new ApiError(401,"Please check your Old password again");
}
// if matched then password hash 
const newHashedPassword = await bcrypt.hash(newPassword,10);
// user find and update password with hashed password
const updatePassword = await User.findByIdandUpdate(
   req?.user?.id,
   {
      password: newHashedPassword,
   },
   {
      new: true,
   }
)

// using trycatch now send mail using mailsender function
try {
   const mailSent = await mailSender(
      updatePassword.email,
      "Password for your account has been updated",
      // password update template required
      passwordUpdated(
          updatePassword.email,
          `Password updated successfully for ${updatePassword.firstName} ${updatePassword.lastName}`
      )
      // "The work of password update is completed"
   )
   console.log("Email sent successfully",mailSent.response);
} catch (error) {//  catch for mail not send 
   throw new ApiError(500,"Error occured while sending mail",error.message);
}


// return success response 
return res.status(200).json(
   new ApiResponse(200,"", "Password Updated Successfully")
)


})



export {
   signup,
   login,
    sendotp,
   changePassword
}











