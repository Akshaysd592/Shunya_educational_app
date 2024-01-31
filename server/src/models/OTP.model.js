import mongoose from 'mongoose'
import mailSender from '../utility/mailSender.js'
// import email template 

const OTPSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
    },
    otp:{
        type:String, 
        required: true,
    },
    createdAt:{
        type: Date,
        default : Date.now,
        expires:  60 * 5 , 
        // expires -> the document get automatically deleted after 5 minutes 
    },
});


// define function to send mail using mailSender function
async function sendVerificationEmail (email,otp){
    // transporter and mailoption already declared in mailsend function

    try {
        const mailResponse  = await mailSender(
            email,
            "Verification Email",
            `This is the otp ${otp}, it will get expired after 5 minutes`// use mailtemplate here
        )
        
    } catch (error) {
        console.log("Error occured while sending mail", error);
        throw error;
    }
}

OTPSchema.pre("save",async function(next){
     console.log("new document saved to database");

     // only send the mail when new document is created 
     if(this.isNew){
        await sendVerificationEmail(this.email,this.otp);

     }

     next();
})


// export otp schema
const OTP = mongoose.model("OTP",OTPSchema);

module.exports = OTP ;
