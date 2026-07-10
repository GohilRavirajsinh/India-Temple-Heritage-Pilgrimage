const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        // process.env.MONGO_URL .env file se connect string uthayega.
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connection Connected Successfully")
    } catch (err) {
        console.log("Database Connection Error", err.message);
        process.exit(1); //Agar database connect nhin hua to server ko stop kar dega.
    }
};

module.exports = dbConnection; // Is function ko bhar bhej rhe hai taki index.js use kar ske.