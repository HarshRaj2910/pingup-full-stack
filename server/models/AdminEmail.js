import mongoose from 'mongoose';

const adminEmailSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    addedBy: { type: String, required: true } // Email of Superadmin
}, { timestamps: true });

const AdminEmail = mongoose.model('AdminEmail', adminEmailSchema);

export default AdminEmail;
