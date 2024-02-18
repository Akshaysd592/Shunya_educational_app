import { Category } from "../models/Category.model.js";
import {asyncHandler} from '../utility/asyncHandler.js'
import {ApiError} from '../utility/ApiError.js'
import {ApiResponse} from '../utility/ApiResponse.js'

function getRandomInt(max){
   return Math.floor(Math.random()*max);
}

const createCategory = asyncHandler(async (req,res)=>{
    //algo 
    // take name and description as a input
    // check name obtained 
    // create db entry
    // if no db entry then return error
    // return success

    const {name, description } = req.body;
    if(!name){
        throw new ApiError(400,"All fields are required");
    }

    const CategoryDetails = await Category.create({
        name: name, 
        description : description,
    })

    console.log(CategoryDetails);
    if(!CategoryDetails){
        throw new ApiError(500,"Category can not be created");
    }

    return res.status(200).json(
        new ApiResponse(200,CategoryDetails,"Category created successfully")
    )
})


const showAllCategories = asyncHandler(async(req,res)=>{
    const allCategories = await Category.find();
  
    if(!allCategories){
        throw new ApiResponse(500,"All Categories can not be obtained");
    }

    return res.status(200).json(new ApiResponse(200,allCategories,"All categories obtained"))
    
})


exports.categoryPageDetails = asyncHandler(async(req,res)=>{
    // algo
    // get categoryid 
    // get details of selected category
    // if not value obtained then return error
    // if selected category courses.length if 0 then return response with zero courses
    // find categoryexcepts selected category
    // get different category randomly
    // find all categories
    // allcourses to get courses out of each category using flatmap
    // sort and slice to return top 10 courses
    // return success

    const {categoryId } = req.body;
    const selectedCategory = await Category.findById(categoryId)
    .populate({
        path:"courses",
        match:{status:"Published"},
        populate: "ratingAndReviews",
    }).exec();

      if(!selectedCategory){
        console.log("Category not found")
        throw new ApiError(404,"Category not found");
      }

      if(selectedCategory?.courses?.length == 0){
        console.log("No course found for selected category")
        throw new ApiError(404,"No courses found for the selected category");
      }

      const categoryExceptSelected = await Category.find({
        _id: {$ne:categoryId}
      })

      let differentCategory = await Category.findOne(
        categoryExceptSelected[getRandomInt(categoryExceptSelected.length)]._id
      ).populate({
        path: "courses",
        match:{status:"Published"},
      }).exec();

      // getting top selling course
      const allCategories = await Category.find()
      .populate(
        {
            path:"Courses",
            match:{status:"Published"},
        }
      ).exec();

      const allCourses = allCategories.flatMap((category)=> category.courses)  // take value in array form and make single array of elements in it means flat it . 
    const mostSellingCourses = allCourses.
    sort((a,b)=>b.sold - a.sold) // make decresing order of elements in array
    .slice(0, 10); // get elements fom 0 to 9


    return  res.status(200).json(
        new ApiResponse(200,{selectedCategory,differentCategory,mostSellingCourses},"Courses for category is obtained")
    )


})

export {createCategory,showAllCategories,categoryPageDetails}