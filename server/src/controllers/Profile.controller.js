import { asyncHandler } from "../utility/asyncHandler";
import {User} from '../models/User.model.js'
import {Profile} from '../models/Profile.model.js'
import { ApiResponse } from "../utility/ApiResponse.js";
import {ApiError} from "../utility/ApiError.js"
import mongoose from "mongoose";
import {CourseProgress} from '../models/CourseProgress.model.js'
import {Course} from '../models/Course.model.js'
import {converSecondtoDuration} from '../utility/secToDuration.js'

const updateProfile = asyncHandler(async (req,res)=>{
    // get data from body
    // user id from middleware
    // userfind
    // profilefind
    // update userdetails using save or create function
    // update profile using save function
    // find user details with populated additional details
    // return response status 200 

    const {
        firstname = "",
        lastname = "",
        dateOfBirth = "",
        about = "",
        contactNumber = "",
        gender = "",
    }  = req.body;

    const id = req.user.id;

     const userDetails  = await User.findById(id);

     const profile = await profile.findById(userDetails.additionalDetails);


     const user = await User.findByIdAndUpdate({id},{
        firstName:firstname,
        lastName : lastname,
     })

     await user.save();

     profile.dateOfBirth = dateOfBirth;
     profile.about = about;
     profile.contactNumber = contactNumber;
     profile.gender = gender ;

     profile.save();


     // find updated data 
     const updatedUser  = await User.findById(id)
     .populate("additionalDetials")
     .exec();

     return res.status(200).json(
        new ApiResponse(200,{updatedUser},"Profile Updated successfully")
     )

})

const deleteAccount = asyncHandler(async(req,res)=>{
       const id = req.user.id;
       console.log(id);

       const user = await User.findById(id);
       if(!user){
         throw new ApiError(404,"User not found")
       }
   
       // deleting the profile first
       await Profile.findByIdAndDelete({
         _id: new mongoose.Types.ObjectId(user.additionalDetails),
       })

       for(const courseId of user.courses){
         await Course.findById(
            courseId,
            {
               $pull :{studentEnroled: id}
            },
            {
               new: true
            }
         )
       }

       // delete the user
       await User.findByIdAndDelete({_id: id})

       res.status(200).json(
         new ApiResponse(200,{},"User deleted Successfully")
       )

       await CourseProgress.deleteMany({userId: id})
})


const getAllUserDetails = asyncHandler(async(req,res)=>{
      const id = req.user.id;

      const userDetails = await User.findById(id)
      .populate("additionalDetials")
      .exec();


      console.log(userDetails);

      res.status(200).json(
         new ApiResponse(
            200,
            {userDetails},
            "User data fetched successfully"
         )
      )
})


const updateDisplayPicture = asyncHandler(async(req,res)=>{
       // get picture from req.
       const displayPicture = req.files.displayPicture
       const userId = req.user.id

       const image = await uploadImageToCloudinary(
         displayPicture,
         process.env.FOLDER_NAME,
         1000,
         1000
       )

       console.log(image);


       //update user 
       const updateProfile = await User.findByIdAndUpdate(
         {
            _id: userId
         },
         {
            image: image.secure_url
         },
         {
            new:true
         }
       )

       return res.status(200).json(
         new ApiResponse(200,updateProfile,"Image updated successfully")
       )
})


const getEnrolledCourses = asyncHandler(async(req,res)=>{
     const userId = req.user.id;
     let userDetails = await User.findById({
      _id: userId
     })
     .populate({
      path:"courses",
      populate:{
         path:"courseContent",
         populate:{
            path:"subSection",
         },
      },
     })
     .exec()

      userDetails = userDetails.toObject();

      var SubsectionLength  = 0;
      
      for(var i = 0;i<userDetails.courses.length;i++){
         let totalDurationInSeconds = 0;
         SubsectionLength = 0;
         for(var j  = 0;j<userDetails.courses[i].coursecontent.length;j++){
            totalDurationInSeconds += userDetails.courses[i].courseContent[j]
            .subSection.reduce((acc,curr)=> acc + parseInt(curr.timeDuration),0);


            userDetails.courses[i].totalDuration = converSecondtoDuration(totalDurationInSeconds)

            SubsectionLength += userDetails.courses[i].courseContent[j].subSection.length
         }

         let courseProgressCount = await CourseProgress.findOne({
            courseID: userDetails.courses[i]._id,
            userId : userId,
         })

         courseProgressCount = courseProgressCount?.completedVideos.length;
         if(SubsectionLength ==0){
            userDetails.course[i].progressPercentage = 100;
         }
         else{
            // make it two decimal point
            const multiplier = Math.pow(10,2)

            userDetails.courses[i].progressPercentage = 
            Math.round(
               (courseProgressCount/SubsectionLength)*100  * multiplier
            ) /multiplier
         }
      }

      if(!userDetails){
         throw new ApiError(400,`Could not find user with id ${userDetails}`)
      }
   

      return res.status(200).json(
         new ApiResponse(200,userDetails.courses)
      )


})



const instructorDashboard = asyncHandler(async(req,res)=>{
   const courseDetails = await Course.find({
      instructor: req.user.id
   })

   const courseData = courseDetails.map((course)=>{
      const totalStudentEnrolled = course.studentEnroled.length
      const totalAmountGenerated = totalStudentEnrolled * course.price

      // creating new object
      const courseDataWithStats = {
         _id : course._id,
         courseName : course.courseName,
         courseDescription : course.courseDescription,


         totalStudentEnrolled,
         totalAmountGenerated,
      }

      return courseDataWithStats
   })
      

   return res.status(200).json(
      new ApiResponse(200,{courses:courseData})
   )

})



export {updateProfile,deleteAccount,instructorDashboard,getAllUserDetails,getEnrolledCourses,updateDisplayPicture,}