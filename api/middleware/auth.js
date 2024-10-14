import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protectRoute = async (req, res, next) => {
    
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({success: false, message: 'No token provided'});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({success: false, message: 'Not authorized to access this route'});
        }
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({success: false, message: 'No user found with this id'});
        }
        req.user = user;
        next();
    } catch (error) {
        console.log('Error in protectRoute', error);
        if(error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({success: false, message: 'Token expired'});
        } else {
            return res.status(500).json({success: false, message: 'Internal server error'});
        }
    }
};
//
