
// capturing the payment
// verify the payment
// sendPaymentSuccessEmail
import {instance}  from '../config/razorpay.config.js'
import mongoose from "mongoose";
import { Course } from "../models/Course.model.js";
import {User} from '../models/User.model.js';
import { ApiError } from "../utility/ApiError";
import { asyncHandler } from "../utility/asyncHandler";
import { ApiResponse } from '../utility/ApiResponse.js';
import crypto from 'crypto'
import {  CourseProgress } from '../models/CourseProgress.model.js';
import {mailSender} from '../utility/mailSender.js'
import {courseEnrollementEmail} from '../mail/templates/courseEnrollmentEmail.js'


const capturePayment = asyncHandler(async(req,res)=>{
    const {course} = req.body;
    const userId = req.user.id;
    if(course.length == 0){
        throw new ApiError(400,"Please provide course id")
    }

    let total_amount = 0;

    for(let course_id of course){
        let course 
        try {
            // find course using its id
            course = await Course.findById(course_id)

            // if course not found then return error 
            if(!course){
                throw new ApiError(400,"Could not find the course for provided id ")
            }


            // check if use already registered for the course
            const uid = new mongoose.Types.ObjectId(useid)
            if(course.studentEnroled.includes(uid)){
                throw new ApiError(300,"User already enrolled ")
            }

            total_amount  += course.price


        } catch (error) {
            console.log(error)
            throw new ApiError(500,"error occured while getting total_amount ",error.message)
        }
    }

    const options = {
        amount : total_amount * 100,
        currency : "INR",
        receipt : Math.random(Date.now()).toString(),
    }

  try {

    // initiate payment with razorpay
    const paymentResponse = await instance.orders.create(options);
    console.log(paymentResponse)
    return res.status(200).json(
        new ApiResponse(200,paymentResponse,"payment captured successfully")
    )
    
  } catch (error) {
    
  }

})

// verify the payment

const verifyPayment = asyncHandler(async(req,res)=>{
     const razorpay_order_id = req.body?.razorpay_order_id
     const razorpay_payment_id = req.body?.razorpay_payment_id
     const razorpay_signature = req.body?.razorpay_signature
     const courses = req.body?.courses

     const userId = req.user.id


     if([razorpay_order_id,razorpay_payment_id,razorpay_signature,courses,userId].select((element)=> element.length == 0)){
        throw new ApiError(300,"Payment Failed")
     }


     let body = `${razorpay_order_id}|${razorpay_payment_id}`

    const expectedSignature = crypto
    .createHmac("sha256",process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex")


    if(expectedSignature === razorpay_signature){
        await enrollStudents(courses,userId,res);
        return res.status(200).json(
            new ApiResponse(200,{},"Payment Verified")
        )
    }

    throw new ApiError(500,"Payment Failed")

})


// send payment success Email
const enrollStudents = async(courses,userId,res)=>{
    if(!courses || !userId){
        throw new ApiError(400,"Please Provide courseId and userId")
    }


    for(const courseId of courses){
        try {
            // find course and enroll student in it
            const enrolledCourse = await Course.findOneAndUpdate(
                {_id : courseId},
                {
                    $push:{studentEnroled:userId},
                    
                },
                {new:true}
            )


            if(enrolledCourse){
                throw new ApiError(500,"Course Not found")
            }

            console.log("Updated course",enrolledCourse);

            const courseProgress = await CourseProgress.create(
                {
                    courseID: courseId,
                    userId : userId,
                    completedVideos: [],
                }
            )

            // find user and make entry of courseid and courseprogress id in its list of enrolled courses
            const enrolledStudent = await User.findByIdAndUpdate(
                userId,
                {
                    $push:{
                        courses: courseId,
                        courseProgress : courseProgress._id,
                    },
                },
                {
                    new:true
                }
            )

            console.log("Enrolled Student: ", enrolledStudent);

            // send an email to the enrolled students
            const emailResponse = await mailSender(
                enrolledStudent.email,
                `Successfully Enrolled into ${enrolledCourse.courseName}`,
                courseEnrollementEmail(
                    enrolledCourse.courseName,
                    `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
                )
            )

            console.log("Email Send Successfully",emailResponse.response)


        } catch (error) {
            console.log(error)
            throw new ApiError(400,"Student can not be enrolled",error.message);
        }
    }
}


const sendPaymentSuccessEmail = asyncHandler(async(req,res)=>{
    const {orderId,paymentId,amount} = req.body;
  
    const userId = req.user.id;

    if(!orderId || !paymentId || !amount || !userId){
        throw new ApiError(400,"Please provide all the details")
    }

    try {
        const enrolledStudent = await User.findById(userId);

        await mailSender(
            enrollStudent.email,
            `Payment Received`,
            paymentSuccessEmail(
                `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
                amount/100,
                orderId,
                paymentId
            )
        )
        

    } catch (error) {
        console.log("Error in sending mail", error)
        throw new ApiError(400,"Could not send email");
    }

})

export {capturePayment,verifyPayment, sendPaymentSuccessEmail}