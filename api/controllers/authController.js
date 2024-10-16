import User from "../models/User.js";
import jwt from "jsonwebtoken";

const signToken = (id) => {
    //jwt token
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

export const signup = async (req, res) => {
    const {name, email, password, age, gender, genderPreference} = req.body;
    try {
        if (!name || !email || !password || !age || !gender || !genderPreference) {
            return res.status(400).json({success: false, message: "All fields are required"});
        }
        
        if(age < 18) {
            return res.status(400).json({success: false, message: "You must be at least 18 years old to use this app"});
        }
        
        if(password.length < 6) {
            return res.status(400).json({success: false, message: "Password must be at least 6 characters long"});
        }
        
        const newUser = new User.create({
            name,
            email,
            password,
            age,
            gender,
            genderPreference
        });
        
        const token = signToken(newUser._id);
        
        res.cookie('jwt', token, {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production' ? true : false
        });
        
        res.status(201).json({success: true, token, user: newUser});
    } catch (error) {
        console.log('Error in signup', error);
        res.status(500).json({success: false, message: error.message});
    }

        
            
};
export const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({success: false, message: "All fields are required"});
        }
        
        const user = await User.findOne({email}).select('+password');
        
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({success: false, message: "Invalid email or password"});
        }
        
        const token = signToken(user._id);
        
        res.cookie('jwt', token, {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production' ? true : false
        });
        
        res.status(200).json({success: true, token, user});
    } catch (error) {
        console.log('Error in login', error);
        res.status(500).json({success: false, message: error.message});
    }
};
export const logout = async (req, res) => {
    res.clearCookie('jwt');
    res.status(200).json({success: true, message: "Logged out successfully"});
};