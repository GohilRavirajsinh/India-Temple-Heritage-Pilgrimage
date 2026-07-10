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
app.use(express.json());  // Isse server incoming JSON data ko samajh payega


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
app.use('/api/temple-data', templeRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/auth', userRoutes);   