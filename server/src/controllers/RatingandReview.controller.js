import { asyncHandler } from "../utility/asyncHandler.js";

import {Course} from '../models/Course.model.js'
import {RatingAndReview} from '../models/RatingandReview.model.js'
import { ApiError } from "../utility/ApiError.js";
import { ApiResponse } from "../utility/ApiResponse.js";
import mongoose from "mongoose";



const createRating = asyncHandler(async(req,res)=>{
      // user id taken 
      const userId = req.user.id;
      const {rating , review , courseId} = req.body;


      // check if the user is enrolled in the course
      const courseDetails = await Course.findOne({
        _id:courseId,
        studentsEnroled:{$eleMatch:{$eq:userId}}
      }
      )

      if(!courseDetails){
        throw new ApiError(404,"Student is not enrolled in this course")
      }


      // check if already user provided review
      const alreadyReviewed = await RatingAndReview.findOne({
        user: userId,
        course: courseId
      })

        if(alreadyReviewed){
            throw new ApiError(403,"Course is already reviewed by user")
        }

        const ratingReview = await RatingAndReview.create({
            rating, 
            review,
            course: courseId,
            user: userId,
        })

        await Course.findByIdAndUpdate(courseId,{
            $push:{
                RatingAndReview: ratingReview,        }
        })

        await courseDetails.save();


        return res.status(200).json(
            new ApiResponse(200,ratingReview,"Rating and Review created successfully")
        )

})

const getAverageRating = asyncHandler(async(req,res)=>{
    const courseId = req.body.courseId;

    // calculate average rating using mongoose aggregate function
    const result = await RatingAndReview.aggregate([
        {
            $match:{
                course:new mongoose.Types.ObjectId(courseId),
                 // since aggregate function so convert into objectId
            },
        },
        {
         $group:{
            _id:null,
            averageRating: {$avg:"$rating"}
         }
        }
    ])



    if(result.length > 0){
        return res.status(200).json(
            new ApiResponse(200,{averageRating:resul[0].averageRating})
        )
    }

    return res.status(200).json(
        new ApiResponse(200,{averageRating:0})
    )
})


const getAllRatingAndReview = asyncHandler(async(req,res)=>{
    const allReview = await RatingAndReview.find({})
    .sort({rating: "desc"})
    .populate(
        {
            path:"user",
            select: "firstName lastName email image "
            // select will give only  provided value as a result
        }
    )
    .populate({
        path:"course",
        select:"courseName",
    })
    .exec()

    if(!allReview){
        throw new ApiError(500,"Failed to retrieve the rating and review for the course")
    }


    return res.status(200).json(
        new ApiResponse(200,{allReview},"All Ratings and reviews")
    )
})

export {createRating,getAverageRating,getAllRatingAndReview}