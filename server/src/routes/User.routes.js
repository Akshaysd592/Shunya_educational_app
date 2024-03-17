import { Router } from "express";
import {auth} from '../middleware/auth.middleware.js'
const router = Router();


import {
    signup,
    login,
    sendotp,
    changePassword, } from '../controllers/Auth.controller.js'

import {
 resetPasswordToken,
 resetPassword
} from '../controllers/ResetPassword.controller.js'

// Route for signup, login and authentication
//**************************
// Authentication Routes 
//**************************** 

// route for signup

// router.use(auth);// to apply this auth middleware to all the routes available
router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/sendotp').post(sendotp);
router.route('/changepassword').post(auth,changePassword) // can also give like this 


router.route('/reset-password-token').post(resetPasswordToken);
router.route('/reset-password').post(resetPassword)

export default router;