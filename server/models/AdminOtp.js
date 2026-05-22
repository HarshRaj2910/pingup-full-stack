import mongoose from 'mongoose';

const adminOtpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    emailOtp: { type: String, required: true },
    mobileOtp: { type: String, required: true }, // We will mock mobile OTP for now
    expiresAt: { type: Date, required: true }
}, { timestamps: true });

// Auto-delete expired OTPs
adminOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const AdminOtp = mongoose.model('AdminOtp', adminOtpSchema);

export default AdminOtp;
