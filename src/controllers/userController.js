const User = require('../models/user');
const bcrypt = require('bcrypt');
const {generateToken} = require('../utils/jwtUtils');

class UserController {
    async register(req, res) {
        try {
            const { name, email, password } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "Email already registered" });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new user
            const user = new User({
                name,
                email,
                password: hashedPassword
            });

            await user.save();

            res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: {
                    name: user.name,
                    email: user.email
                }
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                success: false,
                message: "Error registering user",
                error: error.message
            });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ 
                    success: false,
                    message: "User not found" 
                });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ 
                    success: false,
                    message: "Invalid password" 
                });
            }

            const token = generateToken(user);
            res.status(200).json({
                success: true,
                message: "Login successful",
                data: {
                    token,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email
                    }
                }
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: "Error logging in",
                error: error.message
            });
        }
    }
}

module.exports = new UserController();