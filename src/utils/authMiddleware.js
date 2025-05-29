const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET 

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header missing" });
    }
    const [bearer, token] = authHeader.split(" ");
    if (bearer !== "Bearer" || !token) {
        return res.status(401).json({ message: "Invalid authorization format" });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = user; // Attach user info to request object
        next(); // Proceed to the next middleware or route handler
    });
}

module.exports = {authenticateToken};