const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updatePassword, checkUsersByAdmin, deleteUsersByAdmin } = require('../controller/userController');
const { protect, adminOnly } = require('../middlewares/authMiddleware') // for token validation

router.post('/signup', registerUser);
router.post('/login', loginUser );
router.put('/update-password', protect, updatePassword);
router.get('/all-users', protect, adminOnly, checkUsersByAdmin)
router.delete('/delete-users/:id', protect, adminOnly, deleteUsersByAdmin)

module.exports = router;