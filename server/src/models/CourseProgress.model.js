import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema({
    courseID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Course",
    },
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    completedVideos:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"SubSection",
        },

    ],

});


export const courseProgress  = mongoose.model("courseProgress",courseProgressSchema);