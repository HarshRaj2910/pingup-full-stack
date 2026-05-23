import User from '../models/User.js';

export const verifyAdmin = async (req, res, next) => {
    try {
        const { userId } = req.auth;
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
        const { userId } = req.auth;
        const user = await User.findById(userId);
        
        if (!user || user.role !== 'SuperAdmin') {
            return res.json({ success: false, message: 'SuperAdmin access denied' });
        }
        
        next();
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

import jwt from 'jsonwebtoken';

export const customAdminProtect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key-123');
            req.admin = decoded; // { email, role }
            return next();
        } catch (error) {
            return res.json({ success: false, message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        return res.json({ success: false, message: 'Not authorized, no token' });
    }
};
