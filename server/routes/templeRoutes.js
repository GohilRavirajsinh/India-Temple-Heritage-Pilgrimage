const express = require('express');
const router = express.Router();
const { addTemple, getAllTemple, searchTemples } = require('../controller/templeController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
// Controller ke dono function ko import kiya

router.post('/add', protect, adminOnly, addTemple); // Admin ke liye data add karne ka Route(path)
router.get('/all', getAllTemple); // User ke liye data dekhne ka Route(path)
router.get('/search', searchTemples) // Naya Search Route

module.exports = router;