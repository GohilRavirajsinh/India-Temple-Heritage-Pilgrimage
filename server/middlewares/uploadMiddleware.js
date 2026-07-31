// const multer = require('multer');
// const path = require('path');

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// 1. Cloudinary ko apne account se connect karna
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Storage ka setup (ab folder ki jagah Cloudinary par jayega)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'temples', // Cloudinary me 'temples' naam ka folder banega
        allowed_formats: ['jpg', 'jpeg', 'png'],
    },
});

// 3. Multer upload logic
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB Limit
});

module.exports = upload;
