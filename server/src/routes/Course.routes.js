import { Router } from "express";

const router = Router();

import {
    createCourse,
    getAllCourses,
    getCourseDetails,
    getFullCourseDetails,
    editCourse,
    getInstructorDetails,
    deleteCourse,

} from '../controllers/Course.controller.js'

import {
      showAllCategories,
      categoryPageDetails,
      createCategory
} from '../controllers/Category.controller.js'

import {
    updateCourseProgress,
} from '../controllers/CourseProgress.controller.js'

import {
    createRating,
    getAllRatingAndReview,
    getAverageRating
} from '../controllers/RatingandReview.controller.js'

import {
    deleteSection,
    updateSection,
    createSection
    
} from '../controllers/Section.controller.js'

import {
     createSubSection,
     updateSubSection,
     deleteSubSection
} from '../controllers/SubSection.controller.js'


import {
    auth,
    isStudent,
    isInstructor,
    isAdmin
} from '../middleware/auth.middleware.js'



//************** Course routes **************

router.route('/createCourse').post(auth,isInstructor,createCourse)

router.route('/editCourse').post(auth,isInstructor,editCourse)

router.route('/addSection').post(auth,isInstructor,createSection)

router.route('/updateSection').post(auth,isInstructor,updateSection)

router.route('/deleteSection').post(auth,isInstructor,deleteSection)

router.route('/updateSubSection').post(auth,isInstructor,updateSubSection)

router.route('/deleteSubSection').post(auth,isInstructor,deleteSubSection)

router.route('/addSubSection').post(auth,isInstructor,createSubSection)

router.route('/getInstructorCourses').get(auth,isInstructor,getInstructorDetails)

router.route('/getAllCourses').get(getAllCourses)

router.route('/getFullCourseDetails').post(getCourseDetails)

router.route('/getFullCourseDetails').post(auth,getFullCourseDetails)

router.route('/updateCourseProgress').post(auth,isStudent,updateCourseProgress)


router.route('/deleteCourse').delete(deleteCourse)



//**************** Category routes (only by Admin) ************//

// Category can be created by Admin only
router.route('/createCategory').post(auth,isAdmin,createCategory);

router.route('/showAllCateCategories').get(showAllCategories)

router.route('/getCategoryPageDetails').post(categoryPageDetails)

//***************** Rating and Review ********************//

router.route('/createRating').post(auth,isStudent,createRating);

router.route('/getAvearageRating').get(getAverageRating)

router.route('/getReviews').get(getAllRatingAndReview)


export default router;