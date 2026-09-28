🏙️ Street Care Operation Portal

A web-based Smart Street Management System developed using the MERN stack. The platform helps citizens report street-related issues, administrators manage complaints and assign tasks, and workers track and resolve assigned issues.

📌 Project Overview

The Street Care Operation Portal aims to improve street maintenance and public issue management through a centralized web application. It provides separate dashboards for administrators, citizens and workers to make issue reporting, task assignment and resolution easier.

✨ Features
👤 Citizen Dashboard
User registration and login.
Report street issues such as potholes, damaged roads, garbage, drainage and streetlight problems.
Upload images or videos of reported issues.
Submit issue locations.
Track reported issues and their status.
Submit feedback after issue resolution.
🛠️ Admin Dashboard
Secure administrator login.
View and manage reported street issues.
Manage registered users and workers.
Assign reported issues to workers.
Monitor issue progress and resolution.
View issue statistics and analytics.
👷 Worker Dashboard
Worker registration and login.
View assigned street issues.
Track pending and in-progress tasks.
Update issue status.
Mark assigned issues as resolved.
📊 Additional Features
Role-based dashboards for citizens, administrators and workers.
Issue status tracking.
Interactive maps for issue locations.
Data visualization and analytics.
Centralized issue management.
🧰 Technologies Used
Technology	Purpose
React.js	Frontend user interface
HTML5	Web page structure
CSS3	Styling and responsive design
JavaScript	Application logic
Node.js	Backend runtime
Express.js	Backend API and routing
MongoDB	Database
Mongoose	MongoDB object modeling
Axios	API communication
JWT	Authentication
Bcrypt.js	Password hashing
Leaflet / OpenStreetMap	Map and location functionality
Recharts	Data visualization
Vite	Frontend development server
📂 Project Structure
Street_Care/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
└── README.md

Note: The folder structure above is illustrative. Adjust it to match your actual project files.

⚙️ Installation and Setup
Prerequisites

Install the following before running the project:

Node.js
MongoDB or MongoDB Atlas
Git
A code editor such as Visual Studio Code
1. Clone the Repository
git clone https://github.com/abhijithpoojari02/street-care-operation-portal.git
2. Navigate to the Project
cd street-care-operation-portal
3. Set Up the Backend
cd backend
npm install

Create a .env file inside the backend directory and configure your environment variables:

PORT=5001
MONGO_URI=mongodb://localhost:27017/street-care-portal
JWT_SECRET=replace_with_a_new_secure_random_secret
JWT_EXPIRE=30d

ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_strong_admin_password
ADMIN_NAME=Admin

Important: Replace the example credentials and secret with your own private values. Never upload your .env file to GitHub.

Start the backend:

npm start

If your backend does not have a start script, use:

node server.js
4. Set Up the Frontend

Open a new terminal and navigate to the frontend directory:

cd frontend
npm install

Start the frontend:

npm run dev
5. Access the Application

Open the local URL displayed by Vite in your terminal. If your Vite configuration uses port 3000, visit:

http://localhost:3000

The backend runs on the port configured in your .env file.

🔐 Authentication and Security
Role-based access for citizens, administrators and workers.
JWT-based authentication.
Password hashing using Bcrypt.js.
Environment variables for sensitive configuration.
Protected backend routes for authorized operations.
🚀 Future Enhancements
AI-based street issue classification.
Duplicate issue detection.
Worker performance analytics.
Real-time issue status notifications.
Advanced reporting and analytics.
🎯 Project Objective

To provide a centralized digital platform that simplifies street issue reporting, improves task coordination and supports efficient street maintenance through technology.

👨‍💻 Author

Abhijith Poojari

GitHub: abhijithpoojari02

Project: Street Care Operation Portal

📄 License

This project is developed for educational and learning purposes.
