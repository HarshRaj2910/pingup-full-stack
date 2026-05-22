import express from 'express';
import { adminLoginRequest, verifyAdminLogin, addAdminEmail, getAdminEmails, removeAdminEmail } from '../controllers/adminController.js';
import { customAdminProtect } from '../middlewares/adminAuth.js';

const adminRouter = express.Router();

adminRouter.post('/login-request', adminLoginRequest);
adminRouter.post('/verify-login', verifyAdminLogin);
adminRouter.post('/add-email', customAdminProtect, addAdminEmail);
adminRouter.get('/emails', customAdminProtect, getAdminEmails);
adminRouter.delete('/remove-email/:id', customAdminProtect, removeAdminEmail);

export default adminRouter;
