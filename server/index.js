// Pillar 1: Packages import krna 
const express = require('express');
const dbConnection = require('./config/db');
const cors = require('cors');
require('dotenv').config(); 


const templeRoutes = require('./routes/templeRoutes');

const userRoutes = require('./routes/userRoutes');

// pillar 2: App Initialize aur Middlewares
const app = express();
app.use(cors()); 
app.use(express.json()); 



// Pillar 3: Routing Middleware (Hamesha listen se PEHLE aane chahiye)
app.use('/api/temple-data', templeRoutes);

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