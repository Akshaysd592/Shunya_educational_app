import { Router } from "express";
const router = Router();
import {auth} from '../middleware/auth.middleware.js'

import {
    signup,
    login,
    sendotp,
    changePassword} from '../controllers/Auth.controller.js'


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


export default router;