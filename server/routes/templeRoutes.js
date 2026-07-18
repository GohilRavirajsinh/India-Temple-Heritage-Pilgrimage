const express = require('express');
const router = express.Router();
const { addTemple, getAllTemple, searchTemples, updateTemple, deleteTemple } = require('../controller/templeController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware')
// Controller ke dono function ko import kiya

router.post('/add', protect, adminOnly, upload.single('imageUrl'), addTemple); // Admin ke liye data add karne ka Route(path)
router.get('/all', getAllTemple); // User ke liye data dekhne ka Route(path)
router.get('/search', searchTemples) // Naya Search Route
router.put('/:id', protect, adminOnly, updateTemple);
router.delete('/:id', protect, adminOnly, deleteTemple)

module.exports = router;