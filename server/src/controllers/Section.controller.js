import {Section} from '../models/Section.model.js'
import {Course} from '../models/Section.model.js'
import {SubSection} from '../models/Subsection.model.js'
import { ApiError } from '../utility/ApiError.js';
import { ApiResponse } from '../utility/ApiResponse.js';
import { asyncHandler } from '../utility/asyncHandler.js'



const newSection = asyncHandler(async(req,res)=>{
    // algo 
    //get section and courseid 
    // validate it
    // newsection creation
    // update course with new section id in courseContent and populate as well
    // return success
    const {sectionName , courseId} = req.body;

    if(!sectionName || !courseId){
     throw new ApiError(400,"Missing required properties");
    }

    const newSection = await Section.create({sectionName})

    const updateCourse = await Course.findByIdAndUpdate(
        courseId,
        {
            $push:{
                courseContent: newSection._id,
            }
        },
        {
            new: true
        }
    ).populate({
      path: "courseContent",
        populate:{
            path:"subsection",
        }
    }).exec();

    if(!updateCourse){
        throw new ApiError(500,"Course is not updated with section")
    }

    return res.status(200).json(
        new ApiResponse(200,{updateCourse},"Section created successfully")
    )

})


const updateSection = asyncHandler(async(req,res)=>{
       const {sectionName, sectionId, courseId} = req.body;

       const sectionUpdated =  await Section.findByIdAndUpdate(
            sectionId,
            {
                sectionName
            },
            {new:true}
       )

       const course = await Course.findById(courseId)
       .populate({
        path:"coursecontent",
         populate:{
            path: "subSection",
         },
       })

       console.log(course);

       return res.status(200).json(
        new ApiResponse(200,{course},"Section Updated successfully")
       )
})

const deleteSection = asyncHandler(async(req,res)=>{
    const {sectionId, courseId} = req.body;
    await Course.findByIdAndUpdate(
        courseId,
        {
            $pull :{
                courseContent:sectionId,
            },
        }
       
    ) 
    // find the section
    const section = await Section.findById(sectionId);
     console.log(section);
    // if no section available then return error
    if(!section){
        throw new ApiError(404,"Section not found");
    }

    // delete associated subsections  using deleteMany
    await SubSection.deleteMany({_id:{$in: section.subSection}})

    // delete section 
    await Section.findByIdAndDelete(sectionId);

    // find updated course and return it
    const course = await Course.findById(courseId)
    .populate({
        path: "courseContent",
        populate:{
            path: "subSection",
        },
    }).exec();

   return res.status(200).json(
    new ApiResponse(200,{course}, "Section Deleted..")
   )

})


export {newSection,updateSection,deleteSection}