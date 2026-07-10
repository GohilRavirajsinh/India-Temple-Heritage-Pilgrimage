const Review = require("../model/reviewModel");

// Review save karne ka logic
exports.addReview = async (req, res) => {
    try {
        const newReview = new Review(req.body);
        const savedReview = await newReview.save();

        res.status(201).json({
            success: true,
            message: "Review submitted successfully!",
            data: savedReview
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Failed to submit Review",
            err: err.message
        });
    }
};

// Kisi ek temple ke sare Reviews Dhoondhne ka logic
exports.getTempleReviews = async (req, res) => {
    try {
        // URL ke params se templeId uthayenge (Jaise: /temple/4jbiu7)
        const { templeId } = req.params;

        // Database me check karo jhan templeId match ho jaye
        const reviews = await Review.find({ templeId: templeId }).sort('-createAt');

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch reviews",
            error: err.message
        });       
    }
};  