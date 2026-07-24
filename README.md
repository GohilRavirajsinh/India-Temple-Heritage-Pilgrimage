# 🛕 India Temple Heritage & Pilgrimage Portal

A comprehensive digital directory providing verified information about ancient and modern temples across India. It serves as a guide for devotees, offering details on darshan timings, dress codes, rituals, festivals, and nearby facilities.

## 🌟 Key Features
- **Guest Access:** Browse and search temples by name, state, deity, and city.
- **Devotee Experience (Logged In):** Save and bookmark temples for future reference.
- **Admin Control:** Secure admin portal to add, edit, or delete temple records.
- **Responsive UI:** Beautiful dark theme with saffron and gold accents built with Tailwind CSS.

## 💻 Tech Stack
Built using the **MERN** stack (MongoDB, Express, React, Node.js).

**Frontend (Client)**
- **React.js (Vite):** Core UI framework
- **React Router DOM:** Page navigation
- **Tailwind CSS (v4):** Styling and responsive layout
- **Axios:** API requests

**Backend (Server)**
- **Node.js & Express.js:** Server logic and API endpoints
- **MongoDB & Mongoose:** Database and schema modeling
- **JWT (jsonwebtoken):** Authentication and secure route protection
- **Bcrypt.js:** Secure password hashing
- **Multer:** Handling image uploads
- **CORS & Dotenv:** Security and environment configurations

## 🚀 How to Run Locally

1. **Install Dependencies**
   ```bash
   # Backend
   cd server
   npm install

   # Frontend
   cd ../client
   npm install
   ```

2. **Start the Servers**
   ```bash
   # Backend (runs on port 5000)
   cd server
   npm start

   # Frontend (runs on port 5173)
   cd client
   npm run dev
   ```

---
*Development Note:*
> **Admin Token:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTRhMjI0ZmU3ZjMzMGQyMTIxZTgzY2IiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3ODQyOTI4MTMsImV4cCI6MTc4NDM3OTIxM30.cVKADrEtvoTMK1lpAWO4r1tgjoMtqUdUndrH-qWRubs`