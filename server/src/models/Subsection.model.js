import mongoose from "mongoose";

const SubSectionSchema = new mongoose.Schema({
     title:{
        type:String,
     },
     timeDuration:{
        type:String, // cloudinary provides timeduration in response
     },
     description:{
        type:String,
     },
     videoUrl : {
        type:String,// cloudinary url 
     }

});

module.exports = mongoose.model("SubSection", SubSectionSchema);