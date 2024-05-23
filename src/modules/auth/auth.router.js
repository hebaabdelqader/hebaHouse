import { Router } from 'express';
import * as authController from './auth.controller.js';
import fileUpload, { fileValidation } from "../../services/multer.js";
//import { asyncHandler } from "../../services/errorHandling.js";

const router=Router();
router.post('/signup',fileUpload(fileValidation.image).single('image'),authController.signup);
router.post('/signIn',authController.signIn);
router.patch('/sendCode',authController.sendCode);
router.patch('/forgetPassword',authController.forgotPassword);
router.delete("/invalidConfirm", authController.deleteInvalidConfirm);
router.get("/confirmEmail/:token", authController.confirmEmail);
export default router;