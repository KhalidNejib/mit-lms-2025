# 📘 MIT LMS Backend – 2025

This is the backend API for our Learning Management System (LMS) group project, developed using **Node.js**, **Express**, **TypeScript**, and **MongoDB Atlas**.

> 🧠 Divided into 3 groups: Authentication, Course Management, Content Management

---

## 📁 Project Structure

```
src/
├── config/             # Database and environment config
│   └── database.ts
├── controllers/        # Handles incoming requests
│   ├── auth.controller.ts
│   ├── course.controller.ts
│   └── content.controller.ts
├── services/           # Business logic layer
│   ├── auth.service.ts
│   ├── course.service.ts
│   └── content.service.ts
├── models/             # Mongoose schemas
│   ├── user.model.ts
│   ├── course.model.ts
│   ├── module.model.ts
│   └── content.model.ts
├── routes/             # Route definitions
│   ├── auth.route.ts
│   ├── course.route.ts
│   └── content.route.ts
├── middlewares/        # Authentication, error handling, etc.
│   └── auth.middleware.ts
├── app.ts              # Main application file
```

---

## 👥 Team Groups & Responsibilities

| Group | Members     | Responsibilities                              |
|-------|-------------|-----------------------------------------------|
| 1     | [Add names] | 🔐 Authentication – login, register, JWT     |
| 2     | [Add names] | 📚 Course Management – CRUD courses/modules  |
| 3     | [Add names] | 📦 Content Management – lessons, materials   |

---

## ⚙️ Tech Stack

- Node.js + Express
- TypeScript
- MongoDB Atlas (via Mongoose)
- Postman for API testing
- JWT for authentication
- Git & GitHub for collaboration

---

## 🛠️ Installation & Setup

### 1. Clone the Repo

```bash
git clone https://github.com/KhalidNejib/mit-lms-2025.git
cd mit-lms-2025
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create `.env` File

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 4. Run the Development Server

```bash
npm run dev
```

The server will run at: `http://localhost:5000`

---

## 🚀 API Endpoints

| Route               | Description                           |
|---------------------|---------------------------------------|
| `POST /api/auth/register` | Register new user           |
| `POST /api/auth/login`    | Login and get JWT token     |
| `GET /api/courses`        | List all published courses  |
| `GET /api/courses/:id`    | Get course by ID (with modules) |
| `POST /api/courses`       | Create a new course         |
| `PUT /api/courses/:id`    | Update course               |
| `DELETE /api/courses/:id` | Delete course               |
| `GET /api/content/...`    | (To be added by Group 3)    |

> ✅ All protected routes require JWT.

---

## 🚧 Git Guidelines

### 📁 Branch Naming
- `auth-endpoints` for Group 1
- `course-endpoints` for Group 2
- `content-endpoints` for Group 3

### 🔄 Workflow

1. `git checkout -b your-feature-branch`
2. Work on your part
3. `git add . && git commit -m "Message"`
4. `git push origin your-feature-branch`
5. Make a Pull Request (PR) to `main`

> 🛑 Don’t push directly to `main`.

---

## 📦 .gitignore

This project ignores the following files:

```
node_modules/
.env
dist/
build/
logs/
.vscode/
.DS_Store
```

---

## ✅ Contribution Rules

- Stick to your assigned folders/files.
- Do **not** change folder structure without approval.
- Keep commits clean and meaningful.
- Use TypeScript best practices.
- Add basic validation & error handling.

---

## 📌 Notes

- Database: MongoDB Atlas (cloud)
- Tokens: JWT used for access control
- Populate: Used to link instructors and modules

---

## 📫 Contact

> **GitHub:** [KhalidNejib](https://github.com/KhalidNejib)

---

## 🏁 License

This project is private and for educational purposes only. Please do not distribute without permission.
