const mongoose = require('mongoose');

// Database Schema Define
const templeSchema = new mongoose.Schema({
    templeName: {
        type: String,
        required: [true, "Temple name is Required"],
        trim: true
    },
    state: {
        type: String,
        required: [true, "State name is Required"],
        trim: true
    },
    city: {
        type: String,
        required: [true, "City name is Required"],
        trim: true
    },
    deity: {
        type: String,
        required: [true, "Deity name is Required"],
        trim: true
    },
    history: {
        type: String,
        required: [true, "Historical background is required"]
    },
    darshanTiming: {
        type: String, // Jaise: "6:00 AM - 9:00 PM"
        required: [true, "Darshan Timings are required"]
    },
    festivals: {
        type: [String], // Array of strings (Maan lo ek se zyada festivals hain toh list ban jayegi)
        default: []
    },
    imageUrl: {
        type: String,
        default: ""
    }
}, {
    timestamps: true // Isse database me automatic "createdAt" aur "updatedAt" ka time save ho jayega
})

// Model ko export kar rahe hain taaki iska use controllers me kar sakein
// Mongoose automatic database me iska naam "temples" (plural) rakh dega
const Temple = mongoose.model('Temple', templeSchema); // ('CollectionNameInSingular', yourSchemaName)
module.exports = Temple;