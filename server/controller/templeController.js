const Temple = require('../model/templeModul') // model import
const fs = require('fs');
const path = require('path');

// Nya Function Add Krne ka Function (For Admin)
exports.addTemple = async (req, res) => {
    try {
        if (req.file) {
            req.body.imageUrl = `/uploads/${req.file.filename}`;
        }

        // req.body me wo data aayega jo admin form me bharega!
        const newTemple = new Temple(req.body);
        const savedTemple = await newTemple.save(); // Store in Database

        res.status(201).json({
            success: true,
            message: "Temple Added Succesfully",
            data: savedTemple
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to add temple",
            error: err.message // agar koi field miss huii to error dikhayega
        })
    }
};

// All Temples get karne ka Function (For User)
exports.getAllTemple = async (req, res) => {
    try {
        const temples = await Temple.find(); // Database se list utha rha
        res.status(200).json({
            success: true,
            message: "Data Fetch Successfully",
            data: temples
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message
        })
    }
};

// Search, Filter, Sort & Pagination ka Function (For User)
exports.searchTemples = async (req, res) => {
    try {
        // erq.query ka matlab hai URL se search keywords uthana (?state=Gujarat)
        const { state, city, deity, query, sort, page, limit } = req.query;

        let queryObj = {}; // empty object jisme filters dalenge. 

        // FILTERING LOGIC
        if (query) {
            queryObj = {
                $or: [
                    { templeName: { $regex: String(query).trim(), $options: 'i' } },
                    { state: { $regex: String(query).trim(), $options: 'i' } },
                    { city: { $regex: String(query).trim(), $options: 'i' } },
                    { deity: { $regex: String(query).trim(), $options: 'i' } }
                ]
            };
        } else {
            if (state) queryObj.state = { $regex: String(state).trim(), $options: 'i' };
            if (city) queryObj.city = { $regex: String(city).trim(), $options: 'i' };
            if (deity) queryObj.deity = { $regex: String(deity).trim(), $options: 'i' };
        }

        // Mongoose query ko pehle variable me hold karenge bina execute kiye
        let mongooseQuery = Temple.find(queryObj);

        // SORTING LOGIC 
        if (sort) {
            mongooseQuery = mongooseQuery.sort(sort);
        } else {
            mongooseQuery = mongooseQuery.sort('createdAt'); // By Default nye temples pehle dikhenge
        }

        // PAGINATION LOGIC
        const currentPage = Number(page) || 1;
        const currentLimit = Number(limit) || 10; // default limit 10 temple ki hai
        const skipValue = (currentPage - 1) * currentLimit; // kitne records chhodne hai

        mongooseQuery = mongooseQuery.skip(skipValue).limit(currentLimit);

        // Ab final query ko database par chalana hai.
        const searchedTemples = await mongooseQuery;

        res.status(200).json({
            success: true,
            page: currentPage,
            limit: currentLimit,
            count: searchedTemples.length,
            data: searchedTemples
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Search & Fetch Failed",
            error: err.message
        });
    }
};

// Update Temple Data (For Admin)
exports.updateTemple = async (req, res) => {
    try {
        if (req.file) {
            req.body.imageUrl = `/uploads/${req.file.filename}`;
        } else {
            delete req.body.imageUrl;
        }

        const updatedTemple = await Temple.findByIdAndUpdate(
            req.params.id,
            { $set: req.body }, // Sirf wahi fields badlengi jo request me hain
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Temple Updated Successfully",
            data: updatedTemple
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to update temple",
            error: err.message
        });
    }
}

// Delete Temple Data (For Admin)
exports.deleteTemple = async (req, res) => {
    try {
        const pickTemple = await Temple.findById(req.params.id);

        if (!pickTemple) {
            return res.status(404).json({ success: false, message: "Temple not found" })
        }

        // Delete Image from file system if it exists
        if (pickTemple.imageUrl) {
            const imagePath = path.join(__dirname, '..', pickTemple.imageUrl);
            // Check if file exists then delete
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Temple.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, messsage: "Temple and its image deleted successfully" })
    } catch (err) {
        res.status(500).json({ success: false, message: "Deletion Failed", error: err.message });
    }
}

exports.getSingleTemple = async (req, res) => {
    try {
        const temple = await Temple.findById(req.params.id);
        
        if (!temple) {
            return res.status(404).json({ success: false, message: "Temple not found" });
        }
        
        res.status(200).json({
            success: true,
            data: temple
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch temple details",
            error: err.message
        });
    }
};

// Add Review
exports.addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body; // Fix 1: was res.body (typo)
        const temple = await Temple.findById(req.params.id);
        const User = require('../model/userModel'); // Model import to fetch name

        if (!temple) return res.status(404).json({ message: "Temple not found" });

        const reviewUser = await User.findById(req.user.userId);
        if (!reviewUser) return res.status(404).json({ message: "User not found" });

        // Fix 2: token payload has 'userId' not '_id'
        const alreadyReviewed = temple.reviews.find(r => r.user.toString() === req.user.userId.toString());

        if (alreadyReviewed) {
            return res.status(400).json({ message: "You have already reviewed this temple" });
        }

        const review = {
            user: req.user.userId, 
            name: reviewUser.name, // Fetch real name from database
            rating: Number(rating),
            comment
        };

        temple.reviews.push(review);
        await temple.save();

        res.status(201).json({
            message: "Review Added Successfully",
            data: temple
        });
    } catch (err) {
        res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
}