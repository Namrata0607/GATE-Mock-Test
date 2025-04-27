const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
     // Extract token from the "Authorization" header
     const authHeader = req.header('Authorization');
    //  console.log('Authorization Header:', authHeader); // Debug log

     const token = authHeader?.split(' ')[1]; // Extract token from "Bearer <token>"
     console.log('Token:', token); // Debug log

    if (!token) {
        return res.status(401).json({
            message: "Access denied. No token provided."
        });
    }
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded); // Debug log
        
        req.user = { userId: decoded.userId }; // Attach user ID to the request
        next();
    }catch(error){
        // console.error('Token verification failed:', error.message); // Debug log
        return res.status(403).json({
            message: "Access denied. Invalid or expired token."
        });
    }
};

module.exports = { authMiddleware };