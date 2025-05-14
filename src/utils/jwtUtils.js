const jwt = require('jsonwebtoken');
require('dotenv').config();

function generateToken(user) {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    const payload = {
        id: user._id,
        email: user.email
    };
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1h"});
};

module.exports = {
    generateToken
}