import mongoose from 'mongoose'


const courseSchema = new mongoose.Schema({
    courseName: {type:String},
    courseDescription:{
        type:String
    },
    instructor:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User", // getting instructor
        required: true,
    },
    whatYouWillLearn:{
        type:String,
    },
    courseContent:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Section",
        },
    ],
    ratingAndReviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"RatingAndReview",
        },
    ],
    price:{
        type: Number // type Number
    },
    thumbnail:{
        type: String // cloudinary returns String url

    },
    tag:{
        type:[String], // string  array 
        required:true
    },
    category :{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Category",
    },
    studentEnroled:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:"true",
        },
    ],
    instructions :{
        type:[String],
    },
    status:{
        type:String,
        enum:["Draft","Published"],
    },
    createAt: {
        type: Date,
        default: Date.now 
    },
})

 // export the Course model
export const Course  = mongoose.model("Course",courseSchema);