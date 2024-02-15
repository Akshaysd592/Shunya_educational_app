import mongoose, { mongo } from "mongoose";


// defining user schema using mongoose Schema constructor

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    accountType:{
        type:String,
        enum:["Admin","Student","Instructor"],
        required:true,
    },
    active:{
        type: Boolean,
        default :true,
    },
    approved:{
        type:Boolean,
        default: true,
    },
    additionalDetails:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Profile",
    },
    courses:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Course",
        },
    ],
    token:{
        type:String,
    },
    resetPasswordExpires:{
        type: Date,
    },
    image:{
        type:String,
    },
    courseProgress:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"courseProgress",
        },
    ],

},
{   // timestamp for when the document created and last modified can be available
    timestamps:true 
})


// Export the mongoose model for the user model using name "User"

export const User  = mongoose.model("User",userSchema);