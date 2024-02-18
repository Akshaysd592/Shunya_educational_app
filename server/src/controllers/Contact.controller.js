import {contactUsEmail} from '../mail/templates/contactFormRes.js'
import { ApiResponse } from '../utility/ApiResponse.js';
import { asyncHandler } from '../utility/asyncHandler.js'
import {mailSender} from '../utility/mailSender.js'


const contactUsController = asyncHandler(async(req,res)=>{

    const {email, firstname, lastname, message, phoneNo, countrycode}  = req.body;

    console.log(req.body);

    const emailRes= await mailSender(
        email,
        "Your Data send successfully",
        contactUsEmail(email,firstname, lastname, message, phoneNo,countrycode)
    )

    console.log("Email response", emailRes);

    return res.status(200).json(
        new ApiResponse(200,{emailRes},"Email send successfully")
    )

})

export {contactUsController}