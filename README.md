# StoreRate — Store Rating Management System

A full-stack **Store Rating Management System** built with **React, Node.js, Express.js, and MySQL**.

StoreRate is a role-based web application where customers can discover stores and submit ratings, administrators can manage users and stores, and store owners can monitor ratings and customer feedback.

---

## 📌 Project Overview

StoreRate follows a single authentication system with three role-based experiences:

- **System Administrator**
- **Normal User**
- **Store Owner**

The application includes authentication, authorization, store management, user management, ratings, search, filtering, sorting, dashboards, password management, and role-based navigation.

The project is designed around the FullStack Intern Coding Challenge requirements and uses a relational MySQL schema.

---

## ✨ Key Features

### 🔐 Authentication & Authorization

- User registration
- User login
- JWT-based authentication
- Bearer-token authorization
- Role-based access control
- Protected frontend routes
- Protected backend routes
- Password change
- Logout
- Persistent login session using `localStorage`

### 👤 Normal User

- Create an account
- Login
- Browse stores
- Search stores by name
- Search stores by address
- View overall store ratings
- View their own rating
- Submit a rating from **1 to 5**
- Update an existing rating
- Change password
- Logout

### 🛡️ System Administrator

- View dashboard statistics
- View total users, stores, and ratings
- Create users
- Create stores
- Assign stores to owners
- View users
- Filter users
- Sort users
- View individual user details
- View owner information and store ratings
- View stores
- Filter stores
- Sort stores
- View average store ratings
- View total store ratings
- Logout

### 🏪 Store Owner

- Login
- View owner dashboard
- View all stores assigned to them
- Support multiple owned stores
- View total stores
- View total ratings
- View combined average rating
- View store-wise average ratings
- View customers who rated their stores
- View customer names and emails
- View rating values
- Change password
- Logout

---

# 🧱 Technology Stack

## Frontend

| Technology | Purpose |
|---|---|
| React | User interface |
| Vite | Development and build tool |
| React Router | Client-side routing |
| Axios | API communication |
| Lucide React | Icons |
| CSS | Styling and responsive design |

## Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| MySQL2 | MySQL connectivity |
| MySQL | Relational database |
| JWT | Authentication |
| bcrypt | Password hashing |
| dotenv | Environment variables |
| CORS | Cross-origin requests |

---

# 🏗️ System Architecture

```text
┌───────────────────────────────┐
│           React UI            │
│                               │
│ Home / Login / Register       │
│ User / Admin / Owner Pages   │
└───────────────┬───────────────┘
                │
                │ Axios / REST API
                ▼
┌───────────────────────────────┐
│       Express.js Server       │
│                               │
│ Routes                        │
│ Controllers                   │
│ Authentication Middleware     │
│ Role Authorization Middleware │
└───────────────┬───────────────┘
                │
                │ SQL Queries
                ▼
┌───────────────────────────────┐
│          MySQL DB             │
│                               │
│ users                         │
│ stores                        │
│ ratings                       │
└───────────────────────────────┘
```

---

# 👥 User Roles

## 1. System Administrator

```text
ADMIN
```

Can manage users and stores, assign store owners, view statistics, and monitor ratings.

## 2. Normal User

```text
USER
```

Can register, browse stores, search stores, rate stores, update ratings, and manage their password.

## 3. Store Owner

```text
OWNER
```

Can monitor owned stores, ratings, customer rating activity, and average ratings.

---

# 🗄️ Database Design

The application uses three main tables:

```text
users
   │
   ├───────────────┐
   │               │
   ▼               ▼
stores          ratings
   │               │
   └───────────────┘
```

## Users Table

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(400),
    role ENUM('ADMIN','USER','OWNER') NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

| Field | Description |
|---|---|
| id | Unique user ID |
| name | User's full name |
| email | Unique email |
| password | Hashed password |
| address | User address |
| role | ADMIN, USER, or OWNER |
| created_at | Account creation timestamp |

## Stores Table

```sql
CREATE TABLE stores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    address VARCHAR(400),
    owner_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (owner_id)
    REFERENCES users(id)
    ON DELETE SET NULL
);
```

A store owner can be assigned to multiple stores.

## Ratings Table

```sql
CREATE TABLE ratings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    store_id INT NOT NULL,
    rating TINYINT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (store_id)
        REFERENCES stores(id)
        ON DELETE CASCADE,

    UNIQUE (user_id, store_id),

    CHECK (rating >= 1 AND rating <= 5)
);
```

### Rating rule

```text
One user → One rating per store
```

The `UNIQUE (user_id, store_id)` constraint prevents duplicate ratings.

---

# 🔐 Authentication Flow

```text
User
 │
 │ Login
 ▼
React Frontend
 │
 │ POST /api/auth/login
 ▼
Express Server
 │
 │ Validate credentials
 ▼
MySQL
 │
 │ User found
 ▼
bcrypt password verification
 │
 ▼
JWT generated
 │
 ▼
Frontend receives token
 │
 ├── localStorage.token
 └── localStorage.user
```

Protected requests use:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

The backend verifies the JWT and sets the authenticated user on `req.user`.

---

# 🛡️ Role-Based Access Control

Backend routes use authentication followed by role authorization.

Example:

```js
router.use(authenticate);
router.use(authorize("ADMIN"));
```

Frontend routes are protected using:

```jsx
<ProtectedRoute allowedRoles={["ADMIN"]}>
    <AdminDashboard />
</ProtectedRoute>
```

Example access rules:

```text
USER  → ADMIN dashboard ❌
USER  → OWNER dashboard ❌
OWNER → ADMIN dashboard ❌
ADMIN → ADMIN dashboard ✅
```

---

# 🔑 Password Security

Passwords are hashed using:

```text
bcrypt
```

They are never stored as plain text.

Password requirements:

- 8–16 characters
- At least one uppercase letter
- At least one special character

Example:

```text
Pawan@123
```

---

# 📋 Input Validation

| Field | Validation |
|---|---|
| Name | 20–60 characters |
| Address | Maximum 400 characters |
| Password | 8–16 characters |
| Password | Uppercase required |
| Password | Special character required |
| Email | Valid email format |
| Rating | 1–5 |

---

# ⭐ Rating System

Users can submit:

```text
1 ⭐
2 ⭐
3 ⭐
4 ⭐
5 ⭐
```

### Create Rating

```http
POST /api/ratings
```

```json
{
  "storeId": 1,
  "rating": 5
}
```

### Update Rating

```http
PUT /api/ratings/:storeId
```

```json
{
  "rating": 4
}
```

Users cannot create duplicate ratings for the same store. Existing ratings are updated instead.

---

# 🔎 Store Search

Normal users can search stores by:

- Store name
- Store address

Examples:

```http
GET /api/stores?name=Market
```

```http
GET /api/stores?address=Bhopal
```

The store response includes store information, overall average rating, and the current user's rating.

---

# 📊 Admin Dashboard

The administrator dashboard provides:

```text
Total Users
Total Stores
Total Ratings
```

It also includes:

- User management
- Store management
- User filtering
- User sorting
- Store filtering
- Store sorting
- User details
- Owner details
- Rating information

---

# 🏪 Owner Dashboard

The owner dashboard supports multiple stores.

```text
Owner
 │
 ├── Store A
 │    ├── Average Rating: 4.5
 │    └── Total Ratings: 20
 │
 ├── Store B
 │    ├── Average Rating: 4.0
 │    └── Total Ratings: 12
 │
 └── Store C
      ├── Average Rating: 0
      └── Total Ratings: 0
```

The dashboard also displays customer rating activity.

---

# 📱 Frontend Routes

```text
/
├── Home
│
├── /login
│   └── Login
│
├── /register
│   └── Normal User Registration
│
├── /dashboard
│   └── Normal User Dashboard
│
├── /admin/dashboard
│   └── Admin Dashboard
│
├── /admin/users/:id
│   └── Admin User Details
│
├── /owner/dashboard
│   └── Store Owner Dashboard
│
└── /change-password
    └── Change Password
```

---

# 🧩 Frontend Project Structure

```text
Frontend/
│
├── public/
│
├── src/
│   │
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── UserDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminUserDetails.jsx
│   │   ├── OwnerDashboard.jsx
│   │   └── ChangePassword.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
└── vite.config.js
```

---

# ⚙️ Backend Project Structure

```text
Backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── adminController.js
│   ├── ownerController.js
│   ├── ratingController.js
│   └── storeController.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── roleMiddleware.js
│
├── routes/
│   ├── authRoutes.js
│   ├── adminRoutes.js
│   ├── ownerRoutes.js
│   └── ratingRoutes.js
│
├── .env
├── .env.example
├── package.json
└── server.js
```

---

# 🌐 API Documentation

Base URL:

```text
http://localhost:5000/api
```

## Authentication

### Register

```http
POST /auth/register
```

```json
{
  "name": "Your Full Name With Twenty",
  "email": "user@example.com",
  "address": "Your address",
  "password": "Password@123"
}
```

### Login

```http
POST /auth/login
```

```json
{
  "email": "user@example.com",
  "password": "Password@123"
}
```

### Change Password

```http
PUT /auth/change-password
```

Header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

## User APIs

### Get Stores

```http
GET /stores
```

Examples:

```http
GET /stores?name=ABC
```

```http
GET /stores?address=Bhopal
```

## Rating APIs

### Create Rating

```http
POST /ratings
```

Authorization required.

### Update Rating

```http
PUT /ratings/:storeId
```

Authorization required.

## Admin APIs

Base:

```text
/api/admin
```

### Dashboard

```http
GET /admin/dashboard
```

### Get Users

```http
GET /admin/users
```

Example:

```http
GET /admin/users?name=John&role=USER&sortBy=name&order=ASC
```

### Create User

```http
POST /admin/users
```

### Get User Details

```http
GET /admin/users/:id
```

### Get Stores

```http
GET /admin/stores
```

### Create Store

```http
POST /admin/stores
```

### Get Owners

```http
GET /admin/owners
```

## Owner APIs

Base:

```text
/api/owner
```

### Owner Dashboard

```http
GET /owner/dashboard
```

Authorization:

```http
Authorization: Bearer OWNER_JWT_TOKEN
```

Returns owned stores, store-wise ratings, overall average rating, total ratings, and customer rating activity.

---

# 🔄 Rating Request Flow

```text
User clicks ⭐⭐⭐⭐⭐
        │
        ▼
React Rating Modal
        │
        ▼
Axios
        │
        │ POST /api/ratings
        ▼
Express Route
        │
        ▼
Authentication Middleware
        │
        ▼
JWT Verification
        │
        ▼
Rating Controller
        │
        ▼
MySQL
        │
        ▼
Rating Saved
        │
        ▼
Success Response
        │
        ▼
React Updates UI
```

---

# 🖥️ Installation & Setup

## 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/store-rating-management-system.git
cd store-rating-management-system
```

## 2. Backend Setup

```bash
cd Backend
npm install
```

Create `.env`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=store_rating
JWT_SECRET=your_jwt_secret
```

Start backend:

```bash
npm run dev
```

## 3. Database Setup

Open MySQL / MySQL Workbench:

```sql
CREATE DATABASE store_rating;
USE store_rating;
```

Create the `users`, `stores`, and `ratings` tables using the schema in this README.

## 4. Frontend Setup

Open another terminal:

```bash
cd Frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

---

# 🔐 Environment Variables

Never commit the real `.env` file.

Example `.env.example`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=store_rating
JWT_SECRET=your_jwt_secret
```

---

# 🧪 Testing Checklist

## Authentication

- [ ] Registration works
- [ ] Invalid email rejected
- [ ] Invalid password rejected
- [ ] Duplicate email rejected
- [ ] User login works
- [ ] Admin login works
- [ ] Owner login works
- [ ] Invalid credentials rejected
- [ ] Logout clears session
- [ ] Change password works

## Normal User

- [ ] Dashboard loads
- [ ] Stores display correctly
- [ ] Search by name works
- [ ] Search by address works
- [ ] Average rating displays
- [ ] Own rating displays
- [ ] New rating works
- [ ] Existing rating updates

## Admin

- [ ] Dashboard loads
- [ ] Total users display
- [ ] Total stores display
- [ ] Total ratings display
- [ ] Add user works
- [ ] Add store works
- [ ] User list works
- [ ] User filtering works
- [ ] User sorting works
- [ ] Store list works
- [ ] Store filtering works
- [ ] Store sorting works
- [ ] User details page works
- [ ] Owner details work

## Owner

- [ ] Owner dashboard loads
- [ ] Multiple stores display
- [ ] Store-wise average ratings display
- [ ] Total ratings display
- [ ] Customer ratings display
- [ ] Customer information displays
- [ ] Change password works

## Security

- [ ] Protected routes reject unauthenticated users
- [ ] USER cannot access ADMIN dashboard
- [ ] OWNER cannot access ADMIN dashboard
- [ ] ADMIN can access ADMIN dashboard
- [ ] JWT required for protected APIs
- [ ] Passwords are hashed
- [ ] `.env` is ignored by Git

---

# 🎨 UI / UX

The frontend follows a clean, minimal dashboard design.

Design principles:

- Minimal interface
- Consistent spacing
- Clear typography
- Responsive layouts
- Accessible form controls
- Role-based navigation
- Clear success/error messages
- Interactive rating interface
- Mobile responsive design

The public website includes:

- Hero section
- Features section
- How-it-works section
- Role explanation
- Call-to-action section
- Responsive navigation

---

# 📈 Sorting & Filtering

## User Sorting

```text
Name
Email
Role
```

Supports `ASC` and `DESC`.

## Store Sorting

```text
Store Name
Owner
Average Rating
Total Ratings
```

## User Filters

- Name
- Email
- Address
- Role

## Store Filters

- Store name
- Email
- Address
- Owner

---

# 🔒 Security Practices

The project implements:

- JWT authentication
- Role-based authorization
- bcrypt password hashing
- Protected API routes
- Protected React routes
- Environment variables
- Parameterized SQL queries
- Duplicate rating prevention
- Input validation
- CORS configuration

Example parameterized query:

```js
db.query(
  "SELECT * FROM users WHERE email = ?",
  [email]
);
```

---

# 🚀 Future Improvements

Potential enhancements:

- Refresh token authentication
- Email verification
- Forgot password
- Password reset via email
- Pagination
- Advanced analytics
- Rating distribution charts
- Store categories
- Store images
- Profile management
- Admin activity logs
- Rate limiting
- Swagger API documentation
- Automated tests
- Docker support
- Production deployment
- Cloud database
- CI/CD pipeline

---

# 🐛 Troubleshooting

## MySQL connection failed

Check:

```env
DB_HOST
DB_USER
DB_PASSWORD
DB_NAME
```

Make sure MySQL is running.

## 401 Unauthorized

Possible causes:

- Missing JWT
- Expired JWT
- Invalid JWT
- Token not stored in `localStorage`

## 403 Access Denied

The user is authenticated but does not have the required role.

```text
USER  → ADMIN route ❌
OWNER → ADMIN route ❌
ADMIN → ADMIN route ✅
```

## Frontend API error

Verify:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

Axios should use:

```js
baseURL: "http://localhost:5000/api"
```

---

# 📦 Root Project Structure

```text
StoreRating-App/
│
├── README.md
├── .gitignore
│
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── Frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    └── vite.config.js
```

---

# 📌 Challenge Requirements Coverage

| Requirement | Status |
|---|---|
| React frontend | ✅ |
| Express backend | ✅ |
| MySQL database | ✅ |
| Single login system | ✅ |
| System Administrator | ✅ |
| Normal User | ✅ |
| Store Owner | ✅ |
| User registration | ✅ |
| Store management | ✅ |
| Rating 1–5 | ✅ |
| Rating update | ✅ |
| Store search | ✅ |
| Admin dashboard | ✅ |
| User management | ✅ |
| Store management | ✅ |
| Owner dashboard | ✅ |
| Password change | ✅ |
| Role-based access | ✅ |
| Sorting | ✅ |
| Filtering | ✅ |
| Input validation | ✅ |
| Responsive UI | ✅ |

---

# 📌 Development Workflow

```text
1. Start MySQL
       ↓
2. Start Backend
       ↓
3. Start Frontend
       ↓
4. Register / Login
       ↓
5. Use role-specific dashboard
       ↓
6. Test APIs
       ↓
7. Test authorization
       ↓
8. Test rating workflow
       ↓
9. Run final validation
       ↓
10. Push to GitHub
```

---

# 📊 Project Status

Current implementation includes:

- ✅ Professional landing page
- ✅ Responsive navigation
- ✅ User registration
- ✅ Professional login page
- ✅ JWT authentication
- ✅ Role-based authorization
- ✅ Protected routes
- ✅ Normal user dashboard
- ✅ Store search
- ✅ Store rating
- ✅ Rating update
- ✅ Admin dashboard
- ✅ Admin user management
- ✅ Admin store management
- ✅ User filtering
- ✅ Store filtering
- ✅ User sorting
- ✅ Store sorting
- ✅ Admin user details
- ✅ Owner dashboard
- ✅ Multiple stores per owner
- ✅ Store-wise ratings
- ✅ Customer rating activity
- ✅ Change password
- ✅ Responsive UI
- ✅ MySQL relational schema

---

# 👨‍💻 Author

**Pawan**  
Computer Science & Engineering Student  
Full Stack Developer

### Core Technologies

```text
React
JavaScript
Node.js
Express.js
MySQL
JWT
bcrypt
Axios
HTML
CSS
Git
GitHub
```

---

# ⭐ StoreRate

**Discover stores. Share your experience.**

A role-based store rating platform built as a full-stack development project.
