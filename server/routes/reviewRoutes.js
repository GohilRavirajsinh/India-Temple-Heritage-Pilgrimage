const express = require('express');
const router = express.Router();
const { addReview, getTempleReviews } = require('../controller/reviewController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/add', protect, addReview);
router.get('/temple/:templeId', getTempleReviews); // Yahan :templeId ek variable (param) hai

module.exports = router;