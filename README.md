# Job Portal Project
 A full-stack job portal application where job seekers can create profiles, upload resumes, and apply for jobs, while employers can post job listings and manage applications.

---

## 🚀 Features
- User authentication (Signup/Login)
- Role-based access (Job Seeker / Employer)
- Profile management (with resume upload & avatar)
- Job listings (create, update, delete by employers)
- Apply & save jobs (for job seekers)
- Dashboard for both Job Seekers & Employers
- Responsive UI

---

## 🛠 Tech Stack
**Frontend:** React, Tailwind CSS, React Router, Context API/Redux  
**Backend:** Node.js, Express.js  
**Database:** MongoDB  
**Other Tools:** Multer (file upload), JWT (authentication), dotenv  

---

## 📂 Project Structure
job-portal/
│── backend/ # Node.js backend
│ ├── config/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── utils/ 
│ └── server.js
│
│── frontend/job-portal/ # React frontend
│ ├── public/
│ └── src/
│ ├── components/
│ ├── context/
│ ├── pages/
| ├── routes/
| ├── utils/
│ └── App.js
│
└── README.md

yaml
Copy code

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repo
```bash
git clone https://github.com/M632497/Job-Portal-Project.git
cd Job-Portal-Project
2️⃣ Backend Setup
bash
Copy code
cd backend
npm install
Create a .env file inside backend/:

env
Copy code
PORT=8000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
MAILTRAP_USER=your_mailtrap_username
MAILTRAP_PASS=your_mailtrap_password

Run the server:

bash
Copy code
cd backend
npm start
3️⃣ Frontend Setup
bash
Copy code
cd frontend/job-portal
npm install
npm start

Author
Maria Riaz Khan



