const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    // const token = req.header('Authorization');
    const token = req.header('Authorization')?.split(' ')[1]; // Extract token from "Bearer <token>"
    // console.log('Token Received:', token); // Debug log

    if (!token) {
        return res.status(401).json({
            message: "Access denied"
        });
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log('Decoded Token:', decoded); // Debug log
        
        req.user = { userId: decoded.userId }; // Attach user ID to the request
        next();
    }catch(error){
        next(error);
    }
};

module.exports = { authMiddleware };