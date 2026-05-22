import jwt from 'jsonwebtoken';
import AdminOtp from '../models/AdminOtp.js';
import AdminEmail from '../models/AdminEmail.js';
import sendEmail from '../configs/nodeMailer.js';
import User from '../models/User.js';

const SUPERADMIN_EMAIL = 'aec.it.harshraj@gmail.com';
const SUPERADMIN_CODE = '2910';

export const adminLoginRequest = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) return res.json({ success: false, message: 'Email is required' });

        let role = 'Admin';
        if (email === SUPERADMIN_EMAIL) {
            role = 'SuperAdmin';
        } else {
            const adminDoc = await AdminEmail.findOne({ email });
            if (!adminDoc) {
                return res.json({ success: false, message: 'You are not authorized as an Admin. Please contact Superadmin.' });
            }
        }

        // Generate OTPs
        const emailOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const mobileOtp = Math.floor(100000 + Math.random() * 900000).toString();

        await AdminOtp.create({
            email,
            emailOtp,
            mobileOtp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 mins expiry
        });

        // Send Email
        try {
            await sendEmail({
                to: email,
                subject: 'Admin Login OTP',
                body: `<p>Your Email OTP is: <b>${emailOtp}</b></p><p>This is valid for 10 minutes.</p>`
            });
            console.log(`[MOCK SMS] Mobile OTP for ${email}: ${mobileOtp}`);
            res.json({ success: true, message: 'OTPs sent to your email and mobile (check server console for mobile OTP)' });
        } catch (emailError) {
            console.error('Failed to send email:', emailError.message);
            console.log(`[FALLBACK] Email OTP for ${email}: ${emailOtp}`);
            console.log(`[FALLBACK] Mobile OTP for ${email}: ${mobileOtp}`);
            res.json({ success: true, message: 'Email failed to send. Check server console for both OTPs to continue.' });
        }

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export const verifyAdminLogin = async (req, res) => {
    try {
        const { email, emailOtp, mobileOtp, superAdminCode } = req.body;

        const otpDoc = await AdminOtp.findOne({ email }).sort({ createdAt: -1 });

        if (!otpDoc) return res.json({ success: false, message: 'OTP not found or expired' });

        if (otpDoc.emailOtp !== emailOtp || otpDoc.mobileOtp !== mobileOtp) {
            return res.json({ success: false, message: 'Invalid OTPs' });
        }

        let role = 'Admin';
        if (email === SUPERADMIN_EMAIL) {
            if (superAdminCode !== SUPERADMIN_CODE) {
                return res.json({ success: false, message: 'Access Denied: Invalid Superadmin Code' });
            }
            role = 'SuperAdmin';
        }

        // Delete used OTP
        await AdminOtp.deleteMany({ email });

        // Ensure user exists in our DB and update their role
        let user = await User.findOne({ email });
        if (user) {
            user.role = role;
            await user.save();
        }

        const token = jwt.sign({ email, role }, process.env.JWT_SECRET || 'secret-key-123', { expiresIn: '1d' });

        res.json({ success: true, message: 'Login successful', token, role, email });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export const addAdminEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const addedBy = req.admin.email; // From middleware

        if (req.admin.role !== 'SuperAdmin') {
            return res.json({ success: false, message: 'Only Superadmin can add admins' });
        }

        const existing = await AdminEmail.findOne({ email });
        if (existing) return res.json({ success: false, message: 'Email already exists' });

        await AdminEmail.create({ email, addedBy });
        res.json({ success: true, message: 'Admin email added successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getAdminEmails = async (req, res) => {
    try {
        if (req.admin.role !== 'SuperAdmin') {
            return res.json({ success: false, message: 'Only Superadmin can view admins' });
        }
        const admins = await AdminEmail.find().sort({ createdAt: -1 });
        res.json({ success: true, admins });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const removeAdminEmail = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.admin.role !== 'SuperAdmin') {
            return res.json({ success: false, message: 'Only Superadmin can remove admins' });
        }
        await AdminEmail.findByIdAndDelete(id);
        res.json({ success: true, message: 'Admin removed successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
