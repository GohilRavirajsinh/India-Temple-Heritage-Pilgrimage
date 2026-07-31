// const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads');
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, 'imageUrl-' + uniqueSuffix + path.extname(file.originalname));
//     }
// });

// const fileFilter = (req, file, cb) => {
//     const allowedFileTypes = /jpeg|jpg|png/ ;
//     const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = allowedFileTypes.test(file.mimetype);

//     if(extname && mimetype) {
//         return cb(null, true);
//     } else {
//         cb(new Error('Only .jpeg, .jpg and .png files are allowed!'), false);
//     }
// };

// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 5 * 1024 * 1024},
//     fileFilter: fileFilter
// });

// module.exports = upload;

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
