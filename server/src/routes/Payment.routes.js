import { Router } from "express";

const router = Router();

import {
    capturePayment,
    verifyPayment,
    sendPaymentSuccessEmail
} from '../controllers/Payment.controller.js'
import {
    auth,
    isStudent,
    isInstructor,
    isAdmin
} from  '../middleware/auth.middleware.js'


router.use(auth,isStudent)

router.route('/caputurePayment').post(capturePayment)
router.route('/verifyPayment').post(verifyPayment)

router.route('/sendPaymentSuccessEmail').post(sendPaymentSuccessEmail);




export default router;




