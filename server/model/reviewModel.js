const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    // kis id par review aaya hai, uski ID link karne ke liye
    templeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Temple',
        required: [true, "Review must belong to a temple"]
    },
    // Review likhne vale ka name
    reviewerName: {
        type: String,
        required: [true, "Reviewer name is required"],
        trim: true
    },
    // Star Rating (1 to 5 ke bich)
    rating: {
        type: Number,
        required: [true, "Rating is required"],
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating cannot be more than 5"]
    },
    // 4. User ka comment
    comment: {
        type: String,
        required: [true, "Review comment cannot be empty"],
        trim: true
    }
}, {
    timestamps: true
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;