# 🎓 Online Quiz Test Platform with Face and Sound Detection

A modern, AI-powered online quiz system built using **React.js** and **face-api.js**. This platform not only allows users to take MCQ-based quizzes but also ensures integrity using real-time **face detection**, **mic activity monitoring**, and **auto-submission** on cheating detection.

---

## 🚀 Features

- ✅ **User Login System**
- ✅ **MCQ-Based Quiz** with timer (20 questions, 20 minutes)
- 🎯 **Face Detection** using webcam
- 🎤 **Mic Detection** for sound monitoring
- ⚠️ **Tab Switching Detection**
- 🛑 **Auto Submit** on cheating (after 3 warnings)
- 📸 **Capture Image** and send to admin on cheating
- 📧 **Email Notification** to admin with reason and image
- 📊 **Score Calculation** at the end of the quiz

---

## 🧠 Tech Stack

| Technology     | Usage                         |
|----------------|-------------------------------|
| React.js       | Frontend UI                   |
| Node.js        | Backend logic & API           |
| Express.js     | Server Framework              |
| MongoDB        | Database                      |
| face-api.js    | Face Detection                |
| HTML/CSS       | Web Page Design               |
| JavaScript     | Client-side Logic             |
| Nodemailer     | Email Alerts to Admin         |

---

## 📸 Proctoring Logic

| Event                     | Action Taken                        |
|---------------------------|--------------------------------------|
| Face not visible          | Warning + Capture + Email admin      |
| Multiple faces detected   | Warning + Capture + Email admin      |
| Talking detected          | Warning + Capture + Email admin      |
| Tab switch                | Warning                              |
| After 3 warnings          | Auto-submit quiz                     |

---

## 🔧 Installation

```bash
# Clone the repo
git clone https://github.com/Vaibhav75058/Online-Quiz-Test-Platform-with-Face-and-Sound-Detection.git

# Navigate to project
cd Online-Quiz-Test-Platform-with-Face-and-Sound-Detection

# Install dependencies (frontend and backend separately)
cd client
npm install

cd ../server
npm install

# Start both client and server
npm run dev
