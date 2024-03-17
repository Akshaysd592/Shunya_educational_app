import { Router } from "express";


const router = Router();
import {auth, isInstructor} from '../middleware/auth.middleware.js'
import {
    deleteAccount,
    updateProfile,
    updateDisplayPicture,
    getAllUserDetails,
    getEnrolledCourses,
    instructorDashboard,

} from '../controllers/Profile.controller.js'


//Profile routes
router.use(auth); // auth used in all routes
// To delete the user
router.route('/deleteProfile').delete(deleteAccount)
router.route('/updateProfile').put(updateProfile)
router.route('/getUserDetails').get(getAllUserDetails)


// get enrolled courses
router.route('/getEnrolledCourses').get(getEnrolledCourses)
router.route('/updateDisplayPicture').put(updateDisplayPicture)
router.route('/instructorDashboard').get(isInstructor,instructorDashboard)


export default router;

