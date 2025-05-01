const jwt = require('jsonwebtoken');
require('dotenv').config();

const staffAuthMiddleware = (req, res, next) => {
    // Extract token from the "Authorization" header
    const authHeader = req.header('Authorization');
    const token = authHeader?.split(' ')[1]; // Extract token from "Bearer <token>"

    // console.log("Authorization Header:", authHeader); // Debug log
    // console.log("Extracted Token:", token); // Debug log

    if (!token) {
        console.log("No token provided"); // Debug log
        return res.status(401).json({
            message: "Access denied. No token provided."
        });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("Decoded Token:", decoded); // Debug log

        // Attach staff ID to the request
        req.staff = { staffId: decoded.staffId }; // Assuming the token contains `staffId`
        next();

    } catch (error) {
        return res.status(403).json({
            message: "Access denied. Invalid or expired token."
        });
    }
};

module.exports = { staffAuthMiddleware };