# My Full Stack Learning Journey: India Temple Heritage Pilgrimage

## 💻 1. Client Folder (Frontend)
- React frontend setup initialized for UI development.

## ⚙️ 2. Server Folder (Backend)

### Step 1: Initial Setup & Database Connection
- **Packages Installed**: `express`, `mongoose`, `cors`, `dotenv`
- **Security (`.env`)**: `MONGO_URL` (database link) aur `PORT` ko secret rakha.
- **Database (`config/db.js`)**: `mongoose.connect()` ka use karke MongoDB se connection banaya.
- **Entry Point (`index.js`)**: Server ko start kiya (`app.listen`). Middlewares jaise `app.use(cors())` aur JSON read karne ke liye `app.use(express.json())` lagaye.

### Step 2: MVC Architecture Setup
Code ko organize karne ke liye folders banaye: `model`, `controller`, `routes`, aur `middlewares`.

### Step 3: Database Models (Schemas)
Humne 3 main collections (tables) banaye:
1. **User Model (`model/userModel.js`)**: `name`, `email` (unique), `password` (hash hoga), aur `role` (user/admin).
2. **Temple Model (`model/templeModul.js`)**: `templeName`, `state`, `city`, `deity`, `history`, `darshanTiming`, `festivals` (Array), aur `imageUrl`.
3. **Review Model (`model/reviewModel.js`)**: `templeId` (linking ke liye), `reviewerName`, `rating` (1 se 5), aur `comment`.

### Step 4: Authentication & Middlewares
- **Packages**: `bcryptjs` (password secure karne ke liye) aur `jsonwebtoken` (login token dene ke liye).
- **Middlewares (`middlewares/authMiddleware.js`)**:
  - `protect`: API route ko lock karna. Header se token nikal kar verify karna aur user ko `req.user` mein save karna.
  - `adminOnly`: Role-based security. Check karna ki `req.user.role === 'admin'` hai ya nahi.

### Step 5: Controllers & Routes (Endpoints)
Humne logic (controller) aur URL map (routes) ko jodkar APIs banayi. En sabko `index.js` mein import kiya gaya hai.

#### 👤 A. User & Auth (`routes/userRoutes.js`) -> `/api/auth`
- `POST /signup`: Naya user register karna (password encrypt karke).
- `POST /login`: Email/password check karke JWT token return karna.
- `PUT /update-password`: Password change karna **(`protect`)**.
- `GET /all-users`: Saare users ki list dekhna **(`protect`, `adminOnly`)**.
- `DELETE /delete-users/:id`: Admin ke through kisi bhi user ko delete karna **(`protect`, `adminOnly`)**.

#### 🛕 B. Temple Data (`routes/templeRoutes.js`) -> `/api/temple-data`
- `GET /all`: Saare temples fetch karna.
- `GET /search`: URL query (`req.query`) se filtering aur sorting karna.
- `POST /add`: Naya temple add karna **(`protect`, `adminOnly`)**.
- `PUT /:id`: Temple ki details update karna **(`protect`, `adminOnly`)**.
- `DELETE /:id`: Temple ko database se hatana **(`protect`, `adminOnly`)**.

#### ⭐ C. Reviews (`routes/reviewRoutes.js`) -> `/api/reviews`
- `POST /add`: Kisi temple par naya review aur rating dalna.
- `GET /temple/:templeId`: `req.params.templeId` ka use karke kisi specific temple ke saare reviews fetch karna.

---

### Step 6: Next Step (Image Upload Setup)
- **Planned Package**: `multer` (Images aur files handle karne ke liye).
- **Strategy**: 
  - Server pe ek `uploads/` folder banega.
  - `index.js` mein `app.use('/uploads', express.static('uploads'))` add kiya jayega taaki images browser mein public ho sakein.
  - Temple add karte time image directly server folder mein save hogi aur uska URL path database mein store hoga.