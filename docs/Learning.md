# My Full Stack Learning Journey: India Temple Heritage Pilgrimage

## 💻 1. Client Folder (Frontend)

## ⚙️ 2. Server Folder (Backend)

### Step 2: Server ka Entry Point & Database Connection 
index.js aur db.js

**`index.js` - Server ka Main File (4 Pillars):**
1. **Packages Import**: `express` framework, `dbConnection`, aur `dotenv` ko import kiya. `dotenv.config()` lagaya taaki `.env` file ko read kiya ja sake.
2. **App Initialize & Middlewares**: `express()` se app banaya aur `app.use(express.json())` lagaya. Is middleware ka fayda ye hai ki jab frontend se data (JSON format me) aayega, to server use aasaani se samajh payega bina kisi error ke.
3. **Test Route**: Ek simple `/` (Home) route banaya yeh check karne ke liye ki server browser me sahi se response de raha hai ya nahi.
4. **Server Start**: `dbConnection()` function ko call kiya database jodne ke liye, aur phir `app.listen()` se server ko specify kiye gaye PORT (e.g. 5001) par start karwaya.

**`config/db.js` - Database Connectivity:**
- Is file me **Mongoose** package ka use karke MongoDB database se connect kiya gaya.
- **Concept**: await mongoose.connect(process.env.MONGO_URL); // process.env.MONGO_URL .env file se connect string uthayega.

**`.env` File:**
- Ek `.env` file banayi taaki sensitive data (jaise `MONGO_URL`, `PORT`) safe rahe. Isko code me hardcode nahi karna chahiye for security reasons.

### Step 3: Architecture & Folder Structure (Model, Controller, Routes)
Ab jab database connect ho gaya aur server chalne laga, to code ko organize karne ke liye MVC pattern ke mutabiq 3 naye folders banaye gaye.

#### A. Model (`model/templeModul.js`)
Model batata hai ki database me table (collection) kaisa dikhega.
- **(Export & Naming)**:
  ```javascript
  const Temple = mongoose.model('Temple', templeSchema); // ('CollectionNameInSingular', yourSchemaName)
  // Mongoose automatic database me iska naam "temples" (plural) rakh dega
  module.exports = Temple;
  // Model ko export kar rahe hain taaki iska use controllers me kar sakein
  ```

#### B. Controller (`controller/templeController.js`)
Controller me saara main logic hota hai. Request aane par database se data lana ya bhejte time jo operation hote hain, wo sab yahi likha hai.
  **(Add Temple - req.body)**: // req.body me wo data aayega jo admin form me bharega!
  ```javascript
  // Nya Function Add Krne ka Function (For Admin)
  const savedTemple = await newTemple.save(); // Store in Database
  ```

  **💡 Important Concept Learned - Data Fetch Methods**:
  Note About Data Fetch Methods
  data lane ka 3 main tarika hota hai
  1. req.body : Jab koi bada data (jaise form data, signup credentials) chupkar backend me aata hai, jo URL me nahi dikhta.
  2. req.params.id : Jab data direct URL ke raste me aata hai. Jaise: /api/temples/12345 (Yahan 12345 temple ki ID hai, jise hum req.params.id se uthayenge).
  3. req.query : Jab search filters URL ke aage question mark ? lagakar aate hain. Jaise: /api/temples?search=kedarnath (Yahan search keyword uthane ke liye hum req.query.search use karenge).

- **Difference between req.body & req.query**:
  req.body aur req.query me farq kya hai phir?
  req.body me data chupkar (hidden) aata hai, jo sirf POST ya PUT requests me use hota hai (jaise Signup form ka Password).
  req.query me data saaf-saaf URL me dikhta hai, jo hamesha GET requests me filtering ke liye use hota hai. 

- **(Get All Temples)**:
  ```javascript
  // All Temples get karne ka Function (For User)
  const temples = await Temple.find(); // Database se list utha rha
  ```

- **(Search & Filter - req.query)**:
  ```javascript
  const { state, city, deity, sort, page, limit } = req.query;
  // req.query : tab use hota hai jab hume URL ke andar question mark ? ke baad wala extra data uthana hota hai.
  // req.query ka matlab hai URL se search keywords uthana (?state=Gujarat)
  ```

- **(Sorting Logic)**:
  ```javascript
  mongooseQuery = mongooseQuery.sort('createdAt'); // By Default nye temples pehle dikhenge
  // Agar user ne ?sort=templeName bheja, toh A-Z sort hoga
  // Agar ?sort=-templeName bheja (minus sign), to Z-A sort hoga
  ```

- **(Pagination Logic)**:
  ```javascript
  const currentPage = Number(page) || 1;
  const currentLimit = Number(limit) || 10; // default limit 10 temple ki hai
  const skipValue = (currentPage - 1) * currentLimit; // kitne records chhodne hai
  // page=1 matlab pehla page, limit=2 matlab ek page par sirf 2 temples dikhao
  ```

#### C. Routes (`routes/templeRoutes.js`)
Route ek rasta hai ya map hai jo batata hai ki kaunsi URL hit hone par Controller ka kaunsa function call hoga.

- **(Routing Paths)**:
  ```javascript
  router.post('/add', addTemple); // Admin ke liye data add karne ka Route(path)
  router.get('/all', getAllTemple); // User ke liye data dekhne ka Route(path)
  router.get('/search', searchTemples) // Naya Search Route
  ```

### D. Authentication
1. Normal User (Visitor): Jo temples dekhega, search karega, aur review dalega.
2. Admin:                 Jo naye temples add karega ya update karega.

#### bcryptjs: Yeh user ke password ko hackers se bachane ke liye encrypt (encrypt/hash) karega.
#### jsonwebtoken (JWT): Yeh user ko login karne par ek secret pass/token dega, jisse server use pehchan sake.

### → userModel.js