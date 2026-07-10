const User = require('../model/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//SignUp Function
exports.registerUser = async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        // Ese bhi likh sakte hai → const { name, email, password } = req.body; 

        // Check if user already register or not
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: "User Already Registered, Please Login again" })
        }

        // password encrypt (hash) always before save in database
        const salt = await bcrypt.genSalt(10); // Extra safety layers generate karna
        const hashedPassword = await bcrypt.hash(password, salt); // Original Password that changed into hashed

        // New user create into database (Role default use hi rhega)
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            success: true,
            message: "User Registered Succesfully",
            userId: newUser._id
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Registration Failed",
            error: err.message
        });
    }
};

//Login Function
exports.loginUser = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password
        

        // 1. check if user is exists or not in database
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid Email or Password" });
        }

        // 2. Password Compare krna with bcrypt (Bcrypt check karega ki input password hashed password se match hota hai ya nahi)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid Email or Password" });
        }

        // 3. JWT token generate karna (User ko ek temporary digital ID dena)
        const token = jwt.sign(
            { userId: user._id, role: user.role }, // Payload: Jo data token ke andar chhupana hai
            process.env.JWT_SECRET,                // Secret Key: Jo humne .env me daali thi
            {expiresIn: '1d'}                      // Expiry: Yeh token 1 din tak valid rahega
        );

        res.status(200).json({
            success: true,
            message: "Login Successfully",
            token: token,
            role: user.role
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Check email and password",
            error: err.message
        });
    }
};