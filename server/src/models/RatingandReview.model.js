import mongoose from "mongoose";


const RatingAndReviewSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    rating:{
        type:Number,
        required:true,
    },
    review:{
        type:String,
        required:true,
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
        required:true,
        index: true,
    },
});

export const RatingAndReview = mongoose.model("RatingAndReview",RatingAndReviewSchema);