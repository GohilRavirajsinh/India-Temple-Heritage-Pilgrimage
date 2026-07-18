# My Full Stack Learning Journey: India Temple Heritage Pilgrimage

## 📌 Project Overview
MERN Stack project (MongoDB + Express + React + Node). Root folder has `client`, `server`, `docs`, `Readme.md`. GitHub repo initialized. 
**Goal**: India Temple Heritage & Pilgrimage Information Portal — normal users browse/search temples & write reviews, Admin adds/edits/deletes temple data.

---

## 💻 1. Client Folder (Frontend)

### Tech Used
- **React (Vite setup)**
- **Tailwind CSS** (utility classes, no separate CSS files)
- **axios** (API calls: `.get`, `.post`, `.put`, `.delete`)
- **react-router-dom** (Modern way: `createBrowserRouter` + `RouterProvider` in `main.jsx`, NOT `BrowserRouter` in `App.jsx`)

### Folder Structure (`src/`)
- `components/` → `Navbar.jsx`, `AdminRoute.jsx` (reusable pieces)
- `pages/` → `Home.jsx`, `Login.jsx`, `Register.jsx`, `BrowseTemple.jsx`, `AdminDashboard.jsx`

### Key Concept: Modern Routing (`main.jsx` + Outlet)
- **Purana tarika**: `<BrowserRouter><Routes><Route/></Routes></BrowserRouter>` seedha `App.jsx` ke andar.
- **Modern tarika**: `createBrowserRouter([...])` array `main.jsx` me define hota hai, aur `<RouterProvider router={router}/>` render hota hai.
- `App.jsx` ab sirf **Layout Component** hai — usme `<Navbar/>` fixed hai aur `<Outlet/>` hai jahan child pages automatically render hote hain based on URL.
- **Fayda**: Navbar/Footer baar baar likhna nahi padta; naye router ke loaders/errorElement jaise professional features milte hain. (Login/Register ko Layout se bahar rakha gaya taaki unpar Navbar na dikhe).

### Pages & Components Details

#### Navbar.jsx (Dynamic)
- `useState` + `useEffect` (with `useLocation`) use kiya taaki `localStorage` ka token/role page change hote hi turant re-check ho aur Login/Register buttons ↔ Logout+Role badge turant switch ho (bina manual refresh ke).
- Logout par `localStorage.removeItem('token')` aur `removeItem('role')` chalta hai.

#### Login.jsx
- Form se email aur password alag-alag `useState` variables me liye (Shortcut note: `const {email, password} = req.body`).
- `axios.post('/api/auth/login', {...})` chalaya. Response me token aur role milta hai jo frontend par nahi bana, backend ne bheja hai (Axios ne `response.data` ke andar se nikala).
- Token aur role ko `localStorage.setItem` me save kiya.
- **Role-Based Redirection**: Login success hone par `res.data.role` check karke agar admin hai to `navigate('/admin-dashboard')`, warna `navigate('/')`.

#### Register.jsx
- Same pattern — `name`, `email`, `password` states banaye. `axios.post('/api/auth/signup', ...)` call kiya, aur success par `navigate('/login')`.
- Naming me clear difference rakha: "Sign In" (Register) vs "Login" (Login page).

#### BrowseTemple.jsx
- `useEffect` par component mount hote hi `axios.get('http://localhost:5000/api/temple-data/all')` call hota hai.
- **States**: `temples` (array), `loading`, `error`.
- **Bug Fixed**: Backend se response object me wrapped aata tha (`{success, data}`). Isliye direct `res.data` ko array maan kar `.map()` lagane se crash hota tha (`temples.map is not a function`). Ise fix kiya gaya using standard data extraction (`res.data.data` ya actual keys).
- Frontend par `.map()` se har temple ke liye Tailwind card render hota hai jisme image, state badge, name, description, timings, aur "View Details" button shamil hain.
- **Route Issue Fixed**: URL `/api/temples` aur actual `/api/temple-data/all` match nahi kar rahe the jisse 404 error aaya. Prefix fix karke ise thik kiya gaya.

#### AdminDashboard.jsx
- Ek Form (controlled inputs) banaya jisme admin naya temple add karta hai: `name`, `state`, `timings`, `image`, `description`. Sab ek hi `formData` object state me spread operator (`...formData`) ki madad se manage hote hain.
- Submit par POST request: `axios.post('/api/temple-data/add', formData, { headers: { Authorization: \`Bearer ${token}\` } })` — token pass kiya jata hai.
- **Learning**: Frontend form ke field names aur Backend Model Schema keys ka **exact match** hona zaroori hai, warna validation fail ho jati hai aur data save nahi hota. (Bug manually identified aur fix kiya gaya).
- **Test Flow**: Pehle ek normal user role ke token se form submit ki (Result: `403 Access Permission Denied` kyunki admin guard lagaya gaya tha). Phir MongoDB Compass se role manual 'admin' change karke nayi login generate ki aur finally data add success hua.

#### AdminRoute.jsx (Protected Frontend Route)
- Custom wrapper component: Agar `localStorage` me token nahi hai ya role `!== 'admin'` hai, to frontend user ko `<Navigate to="/login" replace/>` kar deta hai.
- ise `main.jsx` me route pe wrapper laga kar render kiya gaya (`element: <AdminRoute><AdminDashboard/></AdminRoute>`) taaki normal users directly URL type karke route access na kar sake.

---

## ⚙️ 2. Server Folder (Backend)

### Step 1: Initial Setup
- `npm init -y`, packages installed: `express`, `cors`, `dotenv`, `mongoose`, `bcryptjs`, `jsonwebtoken`.
- **Update**: `nodemon` ki jagah ab Node.js ka built-in watch feature (`node --watch index.js`) use kiya gaya hai. Modern aur cleaner setup.

### Step 2: Server ka Entry Point (`index.js` - 4 Pillars)
- **Imports**: `express`, `dbConnection` (`config/db.js`), `cors`, `dotenv.config()`.
- **Middlewares**: `app.use(cors())` (CORS error fix karne ke liye install karke use kiya), `app.use(express.json())`.
- **Server Start**: Pehle `dbConnection()` chalaya aur phir `app.listen(PORT, ...)` start kiya.
- **Route Mounting**: `app.use('/api/temple-data', templeRoutes)`, `app.use('/api/reviews', reviewRoutes)`, `app.use('/api/auth', userRoutes)`. (Note: API auth folder setup me naming user based thi lekin endpoint me auth lagaya).

### Step 3: Database Connection (`config/db.js`)
- `connectDB()` async function Mongoose (`mongoose.connect(process.env.MONGO_URI)`) connect karta hai.
- Agar database connect na ho, to code server process ko stop kar deta hai `process.exit(1)`.

### Step 4: Architecture (Model → Controller → Routes → Middleware)

#### A. Models (`models/`)
- **`templeModel.js`**: `templeName`, `state`, `city`, `deity`, `history`, `darshanTimings`, `festivals` (array of strings). (Form submit karte time fronted names/schemas exact check kiye).
- **`reviewModel.js`**: Relationship established: `templeId` (`type: mongoose.Schema.Types.ObjectId`, ref: `'Temple'`), `reviewerName`, `rating` (1-5), `comment`.
- **`userModel.js`**: `name`, `email` (unique), `password` (hashed), `role` (`enum: ['user','admin']`, default `'user'`).
  - **Security Check**: Enum field ki wajah se normal user galti se signup me `admin` param bhej kar role hijack nahi kar sakta. Pahla admin manual MongoDB par create karna hota hai.

#### B. Controllers (`controllers/`)
- **`templeController.js`**:
  - `addTemple` (POST) — `new Temple(req.body)` phir `.save()`.
  - `getAllTemple` (GET) — `Temple.find()`.
  - `searchTemples` (GET) — Dynamic filtering with query parameters. Search ko case-insensitive rakhne ke liye `$regex + $options: 'i'` lagaya. Paginations (`skip` = `(page-1) * limit`) ka logic lagakar `.sort()`, `.skip()`, aur `.limit()` chaining ki gai hai bina error ke.
  - Complete CRUD (`PUT` & `DELETE`): Dono actions pe middleware array `protect`, `adminOnly` add kiya hai.
- **`reviewController.js`**: `addReview` aur specific ID fetch by param `getTempleReviews`.
- **`userController.js`**:
  - `registerUser`: duplicate mail checking. Use `bcrypt.genSalt(10)` aur `bcrypt.hash()` to encrypt password.
  - `loginUser`: Email dhunda aur match successful hua (`bcrypt.compare`) to `jwt.sign({userId, role}, ...)` ke use se API access ke liye bearer token send kiya.
  - `updatePassword`: **Bug Fixed:** `req.user.id` ki jagah sahi token payload name `req.user.userId` lagaya, password verify karke new hash record me create kiya.
  - `checkUsersByAdmin` aur `deleteUsersByAdmin`: `select('-password')` ke saath response bheja taaki passwords client side leak na ho.

#### C. Routes (`routes/`)
- Teeno resources (temples, reviews, users) ke individual method based routers define aur attach kiye (jaise `router.post('/add', protect, adminOnly, addTemple)`). 

#### D. Middleware (`middlewares/authMiddleware.js`)
- **`protect`**: `req.headers.authorization` read karta hai for `'Bearer'`. Token extract kar verify karta hai (`jwt.verify`). Payload response nikal kar custom request `req.user` me attach karke `next()` function tak point out karta hai.
  - **Bug Fixed**: `exports.protect` ke andar params me `(req, res)` hi tha isliye `"next is not defined"` aaya, manually arguments change kiye `(req, res, next)`.
- **`adminOnly`**: Validate karta hai if `req.user.role === 'admin'`. Warna simple HTTP code `403` set kar return access block bhejta hai.
- **Combo usage**: `protect` ensures banda valid user hai. Phir `adminOnly` check karta hai validation permission hierarchy.

### Step 5: Auth Concept Recap
- **Normal User (Visitor)**: Login kar sakta hai, temples dekh/search/review kar sakta hai.
- **Admin**: Extra privileges like add/edit/delete temples and users management.
- **bcryptjs**: Used to securely hash strings so original plain text passwords are never stored in databases or decipherable anywhere else.
- **jsonwebtoken (JWT)**: Login par unique JSON sign up session state jo backend pe state save hone ke bina header authorization token payload manage karleta hai.