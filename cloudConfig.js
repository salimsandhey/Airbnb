const cloudinary = require('cloudinary').v2;
const cloudinaryStorage = require("cloudinary-multer");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder:"wanderLust",
        allowedFormats:["png","jpg","jpeg"]
    },
});

module.exports ={
    cloudinary,
    storage
};