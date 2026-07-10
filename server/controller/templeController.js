const { mongo } = require('mongoose');
const Temple = require('../model/templeModul') // model import

// Nya Function Add Krne ka Function (For Admin)
exports.addTemple = async (req, res) => {
    try {
        // req.body me wo data aayega jo admin form me bharega!
        const newTemple = new Temple(req.body);
        const savedTemple = await newTemple.save(); // Store in Database

        res.status(201).json({
            success: true,
            message: "Temple Added Succesfully",
            data: savedTemple
        })
    } catch (err) {
        res.status(404).json({
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
        const { state, city, deity, sort, page, limit } = req.query;

        let queryObj = {}; // empty object jisme filters dalenge. 

        // FILTERING LOGIC
        if (state) queryObj.state = { $regex: String(state).trim(), $options: 'i' };
        if (city) queryObj.city = { $regex: String(city).trim(), $options: 'i' };
        if (deity) queryObj.deity = { $regex: String(deity).trim(), $options: 'i' };

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