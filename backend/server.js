// 1. Required modules import kar rahe hain
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

// 2. App init
const app = express();
const PORT = 5000; // Backend port

// 3. Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static("uploads")); // Image access ke liye

// 4. Multer se upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}_${file.originalname}`),
});
const upload = multer({ storage });

// 5. Sample quiz data route
app.get("/api/questions", (req, res) => {
  const questions = [
    {
      question: "What is AI?",
      options: ["Artificial Intelligence", "Adobe Illustrator", "Airtel India"],
      answer: "Artificial Intelligence",
    },
    {
      question: "Who created Python?",
      options: ["Guido van Rossum", "Elon Musk", "Bill Gates"],
      answer: "Guido van Rossum",
    },
  ];
  res.json(questions);
});

// 6. Upload image + cheating reason
app.post("/api/report", upload.single("proof"), async (req, res) => {
  const { reason } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).send("No image received.");
  }

  // Email setup
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "jhavaibhav420@gmail.com", // apna email ID daalo
      pass: "bibc zoww imub kjhb",     // Gmail app password use karo
    },
  });

  const mailOptions = {
    from: "jhavaibhav420@gmail.com",
    to: "jhavaibhav419gmail.com",
    subject: "⚠️ Cheating Alert in Online Exam",
    text: `Cheating Reason: ${reason}`,
    attachments: [
      {
        filename: file.originalname,
        path: path.join(__dirname, "uploads", file.filename),
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Cheating Report Sent Successfully!");
    res.send("Report sent successfully.");
  } catch (error) {
    console.error("Mail failed:", error);
    res.status(500).send("Failed to send email.");
  }
});

// 7. Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
