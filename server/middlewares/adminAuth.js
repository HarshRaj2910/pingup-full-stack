import User from '../models/User.js';

export const verifyAdmin = async (req, res, next) => {
    try {
        const { userId } = req.auth();
        const user = await User.findById(userId);
        
        if (!user || (user.role !== 'Admin' && user.role !== 'SuperAdmin')) {
            return res.json({ success: false, message: 'Admin access denied' });
        }
        
        next();
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const verifySuperAdmin = async (req, res, next) => {
    try {
        const { userId } = req.auth();
        const user = await User.findById(userId);
        
        if (!user || user.role !== 'SuperAdmin') {
            return res.json({ success: false, message: 'SuperAdmin access denied' });
        }
        
        next();
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
