// Pillar 1: Packages import krna 
const express = require('express');
const dbConnection = require('./config/db');
const cors = require('cors');
require('dotenv').config(); 
const path = require('path');

const templeRoutes = require('./routes/templeRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');

// pillar 2: App Initialize aur Middlewares
const app = express();
app.use(cors()); 
app.use(express.json()); 

// Static folder configuration (hamesha routes se pehle)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Pillar 3: Routing Middleware (Hamesha listen se PEHLE aane chahiye)
app.use('/api/temple-data', templeRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/auth', userRoutes);

// Test Route
app.get('/', (req, res) => {
    res.send('Server is Running');
});

// Pillar 4: Database Connect aur Server Start Karwana (Hamesha Sabse NICHE)
const PORT = process.env.PORT || 5001;
dbConnection(); 

app.listen(PORT, () => {
    console.log(`server is running on port: ${PORT}`);
});