
import {SubSection} from '../models/Subsection.model.js'
import {asyncHandler} from '../utility/asyncHandler.js'
import {ApiError} from '../utility/ApiError.js'
import { CourseProgress } from '../models/CourseProgress.model.js';
import { ApiResponse } from '../utility/ApiResponse.js';







const updateCourseProgress = asyncHandler(async(req,res)=>{
    // get course  and subsectionid 
    const {courseId, subsectionId} = req.body;

    // get userid from middleware
    const userId = req.user.id;
    // find subsection  using subsectionid
    const subsection = await SubSection.findById(subsectionId)


    // if not found send error
    if(!subsection){
        throw new ApiError(404,"Invalid Subsection")
    }
    // now find course and userid
    const courseProgress = await CourseProgress.findOne({
            courseID: courseId,
            userId: userId,
    })
    // if not courseProgress then also return error
    if(!courseProgress){
        throw new ApiError(404,"course progress does not exists")
    }
    else{
        if(courseProgress.completedVideos.includes(subsectionId)){
            throw new ApiError(400,"Subsection already completed")
        }
    }
    // if courseprogress.completed include subsectionId then also return error
    // courseprogress.completedvideo.push 
    courseProgress.completedVideos.push(subsectionId)
    // save 
     await courseProgress.save();
    // return response

    return res.status(200).json(
        new ApiResponse(200,{},"Course progress updated")
    )

})

export {updateCourseProgress}