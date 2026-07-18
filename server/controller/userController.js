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

// Update password by user side!
exports.updatePassword = async (req, res) => {
    try {
        
        // const currentPassword = req.body.currentPassword;
        // const newPassword = req.body.newPassword;
        const { currentPassword, newPassword } = req.body // Uper line is Destructure of this line!

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        // privious password is right or not check it!
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Incorrect current password" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ success: true, message: "Password Change Succesfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error", error: err.message})
    }
}

// Show All User (For Admin)
exports.checkUsersByAdmin = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ success: true, data: users});
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to fetch users", error: err.message});
    }
};

// Delete any User (DELETE /api/user/:id) (For Admin)
exports.deleteUsersByAdmin = async (req, res) => {
    try {
        const deleteUser = await User.findByIdAndDelete(req.params.id);
        if (!deleteUser) {
            return res.status(404).json({ success: false, message: "User not found"});
        }

        res.status(200).json({
            success: true,
            message: "User Deleted By Admin"
        });
    } catch (err) {
        res.status(500).json({ success:false, message:"User Deletion Failed", error: err.message});
    }
}