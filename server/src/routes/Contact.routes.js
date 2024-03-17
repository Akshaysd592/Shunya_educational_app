import { Router } from "express";
import {contactUsController} from '../controllers/Contact.controller.js'
const router = Router();


router.route('/contact').post(contactUsController)

export default router;

