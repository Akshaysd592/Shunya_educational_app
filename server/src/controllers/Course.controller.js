
import { asyncHandler } from "../utility/asyncHandler.js";
import { ApiError } from "../utility/ApiError.js";
import {User} from '../models/User.model.js'
import {Category} from '../models/Category.model.js'
import {Course} from '../models/Course.model.js'
import uploadImageToCloudinary from '../utility/imageUploader.js'
import { ApiResponse } from "../utility/ApiResponse.js";
import {convertSecondsToDuration} from '../utility/secToDuration.js'
import {CourseProgress} from '../models/CourseProgress.model.js' 
import { SubSection } from "../models/Subsection.model.js";
import { Section } from "../models/Section.model.js";

// only instructor can create the course
const createCourse = asyncHandler(async(req,res)=>{
 
    const userId = req.user.id;

    // get all the fields from the request body
    let {courseName,courseDescription,whatYouWilllearn,price, tag:_tag,category, status,
     instructios: _instructions,} =req.body;

     // getting thumbnail from request file
     const thumbnail = req.files.thumbnailImage;


     // converst tag and instructions from stringified array to array
     const tag = JSON.parse(_tag);
     const instructions = JSON.parse(_instructions);

     console.log("tag",tag);
     console.log("instruction",instructions);

     // validation of req body data is present or not
     if(!courseName || !courseDescription || !whatYouWilllearn ||
        !price || !tag.length || !thumbnail || !category ||
        !instructions.length){
            throw new ApiError(400,"All fields are required");
        }

    if(!status || status == undefined){
        status = "Draft"
    }
   
  const instructorDetails = await User.findById(userId,
    {
        accountType:"Instructor",
    })
    if(!instructorDetails){
        throw new ApiError(404,"Instructor details not found");
    }

    // check category is available or not
    const categoryDetails = await  Category.findById(category);

    if(!categoryDetails){
        throw new ApiError(404,"Category Details not found")
    }


    const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
    )

    console.log(thumbnailImage);

    const newCourse = await Course.create({
        courseName,
        courseDescription,
        instructor: instructorDetails._id,
        whatYouWillLearn: whatYouWilllearn,
        price,
        tag,
        category: categoryDetails._id,
        thumbnail : thumbnailImage.secure_url,
        status: status,
        instructions,
    })

    await User.findByIdAndUpdate(
        {
            _id: instructorDetails._id,
        },
        {
            $push:{
                courses: newCourse._id,
            }
        },
        {
            new:true
        }
    )

    // add this new course to category also
    const categoryDetails2 = await Category.findByIdAndUpdate(
        {_id: category},
        {
            $push:{
                courses: newCourse._id,
            }
        },
        {
            new: true
        }

    )

    console.log(categoryDetails2);

    return res.status(200).json(
        new ApiResponse(200,{newCourse},"Course created Successfully")
    )
})

// Edit course Details 
const editCourse = asyncHandler(async(req,res)=>{
    const {courseId} =req.body;

    const updates = req.body;
    const course = await Course.findById(courseId);

    if(!course){
        throw new ApiError(404,"Course Not found");
    }

    // if thumbnail image is found then update it
    if(req.files){
        console.log("Thumbnail Update");
        const thumbnail = req.files.thumbnailImage
        const thumbnailImage = await uploadImageToCloudinary(
            thumbnail,
            process.env.FOLDER_NAME
        )

        course.thumbnail  = thumbnailImage.secure_url;
    }

// update only the fields that are present only in  the request body
  for(const key in updates){
     if(updates.hasOwnProperty(key)){
        if(key === "tag" || key === "instructions"){
            course[key] = JSON.parse(updates[key]);
        }
        else{
            course[key] = updates[key];
        }
     }
  }

  await course.save();

    const updateCourse = await Course.findOne({
        _id:courseId,
    }
    )
    .populate(
        {
            path:"instructor",
            populate:{
                path: "additionalDetails",
            },
        }
    )
    .populate("category")
    .populate("ratingAndReview")
    .populate({
        path:"courseContent",
        populate:{
            path:"subSection",
        }
    })
    .exec();

    return res.status(200).json(
        new ApiResponse(200,{updateCourse},"Course updated Successfully")
    )


})

 const getAllCourses = asyncHandler(async(req,res)=>{
      const allCourses = await Course.find(
        {
            status: "Published"
        },
        {
            courseName:true,
            price :true,
            thumbnail:true,
            instructor:true,
            ratingAndReviews:true,
            studentEnroled:true
        }
      ).populate("instructor")
      .exec()

   if(!allCourses){
    throw new ApiError(404,"Can't fetch course Data");
   }
       
    return res.status(200).json(
        new ApiResponse(200,allCourses,"All course obtained")
    )
})

const getCourseDetails = asyncHandler(async(req,res)=>{
    const {courseId} = req.body;
    const courseDetails = await Course.findOne(
        {
            _id: courseId,
        }
    )
    .populate({
        path:"instructor",
        populate:{
            path: "additionalDetials ",
        }
    })
    .populate("category")
    .populate("ratingAndReview")
    .populate(
        {
            path: "courseContent ",
            populate:{
                path : "subSection",
                select: "-videoUrl",
            }
        }
    )
    exec();


    if(!courseDetails){
        throw new ApiError(400,`Could not find course with Id : ${courseId}`)
    }
    
    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content)=>{
        content.subSection.forEach((subSection)=>{
            const timeDurationInSeconds = parseInt(subSection.timeDuration)
            totalDurationInSeconds += timeDurationInSeconds;
        })
    })


    const totalDuration  = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json(
        new ApiResponse(200,{courseDetails,totalDuration})
    )

})


const getFullCourseDetails = asyncHandler(async (req,res)=>{
    const {courseId} = req.body;
    const userId = req.user.id;

    const courseDetails = await Course.findOne(
        {
            _id: courseId
        }
    ).populate({
        path:"instructor",
        populate:{
            path: "additionalDetails",
        }
    })
    .populate("category")
    .populate("ratingAndReview")
    .populate({
        path: "courseContent",
        populate:{
            path:"subSection"
        }
    })
    .exec();


    let courseProgressCount = await CourseProgress.findOne({
        courseID: courseId,
        userId: userId,
    })

    console.log("courseProgressCount: ",courseProgressCount);

    if(!courseDetails){
        throw new ApiError(404,`Course not find course with id: ${courseId}`)
    }

    let totalDurationInSeconds  = 0;
    courseDetails.courseContent.forEach((content)=>{
        content.subSection.forEach((subSection)=>{
            const timeDurationInSeconds = parseInt(subSection.timeDuration);
            totalDurationInSeconds += timeDurationInSeconds;
        })
    })

    const totalDuration = totalDurationInSeconds;

    return res.status(200).json(
        new ApiResponse(200,{courseDetails,totalDuration,completedVideos: courseProgressCount?.completedVideos?
        courseProgressCount?.completedVideos: []})
    )



})


// Get instructor details
const getInstructorDetails = asyncHandler(async(req,res)=>{
    // get instructorID from req.user.id
    const instructorId = req.user.id;

    // find instructor details  in decresing order
    const instructorCourses = await Course.find({
        instructor: instructorId
    }).sort({createdAt: -1})

    if(!instructorCourses){
        throw new ApiError(500,"Failed to retrive instructor courses")
    }

    // return response 
    return res.status(200).json(
        new ApiResponse(200,{instructorCourses},"Instructor details obtained successfully")
    )
})

const deleteCourse = asyncHandler(async(req,res)=>{
     // courseId taken as input
     const courseId = req.body;
     // find course by id
     const course  = await Course.findById(courseId);

     // if not found return response
     if(!course){
        throw new ApiError(404,"Course not found for the course")
     }
     // unenroll all student from the course
     const studentEnrolled = course.studentEnroled
     for(const studentId of studentEnrolled){
        await Course.findByIdAndDelete(studentId,
            {
                $pull :{courses: courseId}
            })
     }
     // delete subsection and section
     const courseSections  = course.courseContent
     for(const sectionId of courseSections){
        const section = await Section.findById(sectionId)
        if(section){
            const subSections  = section.subSection
            for(const subSectionId of subSections){
             await SubSection.findByIdAndDelete(subSectionId)
            }
        }
        //  delete section
     await Section.findByIdAndDelete(sectionId)
     }

     // delete course
     await Course.findByIdAndDelete(courseId)
     
     // return response
     return res.status(200).json(
        new ApiResponse(200,{},"Course Deleted successfully")
     )
})

export {createCourse,editCourse,getAllCourses,getCourseDetails,getInstructorDetails,deleteCourse,getFullCourseDetails};