# 🏙️ Street Care Operation Portal 🛠️

A web-based Smart Street Management System developed using the MERN stack. The platform helps citizens report street-related issues, administrators manage complaints and assign tasks, and workers track and resolve assigned issues.

---

## 📌 Project Overview

The **Street Care Operation Portal** aims to improve street maintenance and public issue management through a centralized web application. It provides separate dashboards for administrators, citizens, and workers to make issue reporting, task assignment, and resolution seamless and efficient.

---

## ✨ Features

### 👤 Citizen Dashboard
- User registration and login.
- Report street issues (Potholes, Damaged Roads, Garbage, Drainage, Streetlights, Parks).
- Upload images or videos of reported issues.
- Submit precise issue locations.
- Track status of reported issues in real-time.
- Submit feedback after issue resolution.

### 🛠️ Admin Dashboard
- Secure administrator login.
- Automated AI-powered issue classification.
- View and manage all reported street issues.
- Manage registered users and workers.
- Assign reported issues to workers.
- Monitor resolution progress and analytics.

### 👷 Worker Dashboard
- Worker registration and login.
- View assigned tasks and details.
- Track pending and in-progress tasks.
- Update task status and mark issues as resolved.

---

## 🧰 Technologies Used

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js, Vite, Tailwind CSS, Axios, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Authentication** | JSON Web Tokens (JWT), Bcrypt.js |
| **File Storage** | Multer (Image & Video Uploads) |
| **Maps & AI** | Leaflet / OpenStreetMap, Keyword AI Classifier |

---

## 📂 Project Architecture

```
Street_Care/
├── backend/            # Express.js REST API & MongoDB models
│   ├── config/         # Multer file upload & app configurations
│   ├── controllers/    # API Controllers (Issues, Complaints, Workers, Analytics)
│   ├── middleware/     # JWT Auth & Admin protection middleware
│   ├── models/         # Mongoose Schemas (User, Worker, Issue, Complaint)
│   ├── routes/         # API Route handlers
│   ├── scripts/        # Seed scripts (createAdmin.js)
│   ├── services/       # AI Classifier service
│   └── server.js       # Main server entrypoint
└── frontend/           # React + Vite Single Page Application
    ├── src/
    │   ├── components/ # Reusable UI components
    │   ├── context/    # Auth & state management context
    │   ├── pages/      # User, Worker, & Admin pages
    │   └── services/   # Axios API client setup
    └── package.json
```

---

## ⚙️ Installation and Setup

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (running locally or MongoDB Atlas URI)
- [Git](https://git-scm.com/)

---

### 1. Clone the Repository

```bash
git clone https://github.com/abhijithpoojari02/street-care-operation-portal.git
cd street-care-operation-portal
```

---

### 2. Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` environment variables:
   ```env
   PORT=5001
   MONGO_URI=mongodb://localhost:27017/street-care-portal
   JWT_SECRET=your_jwt_secret_key_here

   # Default Admin Credentials
   ADMIN_EMAIL=admin@streetcare.com
   ADMIN_PASSWORD=Admin@123
   ADMIN_NAME=Admin
   ```

5. (Optional) Seed the default admin user:
   ```bash
   node scripts/createAdmin.js
   ```

6. Start the backend server:
   ```bash
   npm start
   # or for development with nodemon:
   npm run dev
   ```

---

### 3. Frontend Setup

1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

5. Access the application in your browser (typically `http://localhost:5173` or `http://localhost:3000`).

---

## 🔑 Default Credentials for Local Testing

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@streetcare.com` | `Admin@123` |

> ⚠️ **Security Note**: For production deployments, change all default credentials and update `JWT_SECRET` in your `.env` file. Never commit `.env` files to public repositories.

---

## 🔐 Authentication & Security

- Role-based access control for Citizens, Administrators, and Workers.
- JWT-based authorization headers.
- Password hashing using `bcryptjs`.
- Strict `.gitignore` rules ensuring secrets and `.env` files remain private.

---

## 👨‍💻 Author

**Abhijith Poojari**  
GitHub: [@abhijithpoojari02](https://github.com/abhijithpoojari02)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
