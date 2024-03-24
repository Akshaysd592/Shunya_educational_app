
import {asyncHandler} from '../utility/asyncHandler.js'
import {User} from '../models/User.model.js'
import {ApiError} from '../utility/ApiError.js'
import {ApiResponse} from '../utility/ApiResponse.js'
import crypto from 'crypto'
import {mailSender} from '../utility/mailSender.js'
import bcrypt from 'bcrypt'





const resetPasswordToken =  asyncHandler(async(req,res)=>{
    // get email
    const email = req.body.email
    const user = await User.findOne({email:email});

    if(!user){
        throw new ApiError(404,`This Email ${email} is not registered with us, Enter a valid email`)
    }

     // generated token that will be matched in url provided
    const token = crypto.randomBytes(20).toString("hex");

    const updateUser = await User.findOneAndUpdate({
        email:email
    },
    {
        token: token ,
        resetPasswordExpires: Date.now() + 3600000 // 6 minutes
    },{
        new:true
    })
  
    console.log("updated User with token", updateUser)

    const url = `http://localhost:3000/update-password/${token}`


    await mailSender(
       email,
       "Password Reset",
       `Your link for all email verification is ${url} . Please click this url to reset your password.`
    )

    return res.status(200).json(
        new ApiResponse(200,{},"Email send successfully,Please click your email to continue further")
    )
})




const resetPassword = asyncHandler(async(req,res)=>{

     const {password , confirmPassword,token} = req.body;

     // validation
     if(password !== confirmPassword){
        throw new ApiError(400,"Password and ConfirmPassword does not match")
     }

     const userDetails = await User.findOne({token:token})

     if(!userDetails){
        throw new ApiError(400,"Token is Invalid")
     }


     if(userDetails.resetPasswordExpires < Date.now()){
        throw new ApiError(403,"Token is Expired, Please Regenerate your token")
     }

     // now reset password process 
     const encryptedPassword = await bcrypt.hash(password,10);

     const updateNewPassword = await User.findOneAndUpdate(
        {token: token},
        {password : encryptedPassword},
        {new: true}
     )

     if(!updateNewPassword){
          throw new ApiError(500,"Some Error in updating the password")
     }

     return res.status(200).json(
        new ApiResponse(200,{},"Password updated Successfully")
     )


})

export{resetPasswordToken,resetPassword}