// Pillar 1: Packages import krna 
const express = require('express');
const dbConnection = require('./config/db')
const cors = require('cors');
require('dotenv').config(); // Yeh line .env file ko read karti hai

const templeRoutes = require('./routes/templeRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const userRoutes = require('./routes/userRoutes')

// pillar 2: App Initialize aur Middlewares
const app = express();
app.use(cors()); // Ise Frontend or Backend ke ports match kaevaye jate hai. btaya jata hai ki 5000 and 5130 apne hi sites hai.
// 1. JSON Data ke liye (in project use)
app.use(express.json()); // Isse server incoming JSON data ko samajh payega

// app.use(express.urlencoded({ extended: true })); // Isse server HTML forms se aane wale data ko samajh payega (not use only for learning purpose)
// app.use(express.static('public')); // Isse server images, CSS, aur frontend JS files ko browser tak deliver kar payega (not use only for learning purpose)

// Pillar 3: Test Route
app.get('/', (req, res) => {
    res.send('Server is Running')
})

// Pillar 4: Server Start Karwana
const PORT = process.env.PORT || 5001;
dbConnection(); // ye call hote database connect ho jayega.

app.listen(PORT, () => {
    console.log(`server is running on port: ${PORT}`)
})
// Routing Middleware
app.use('/api/temple-data', templeRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/auth', userRoutes);