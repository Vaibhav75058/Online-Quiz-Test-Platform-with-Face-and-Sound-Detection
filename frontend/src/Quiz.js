// src/Quiz.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Quiz.css';
import questions from './questions';
import startMicMonitoring from './utils/micDetection';
import * as faceapi from 'face-api.js';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(20 * 60); // 20 minutes
  const [tabWarningCount, setTabWarningCount] = useState(0);
  const [faceNotDetectedCount, setFaceNotDetectedCount] = useState(0);
  const [voiceWarningCount, setVoiceWarningCount] = useState(0);
  const videoRef = useRef();
  const navigate = useNavigate();

  // 🔐 Check Login
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      navigate('/');
    }
  }, [navigate]);

  // 📷 Load face detection model
  useEffect(() => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    ]).then(startVideo);
  }, []);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      videoRef.current.srcObject = stream;
    });
  };

  // 👀 Face detection
  useEffect(() => {
    const interval = setInterval(async () => {
      if (videoRef.current) {
        const detection = await faceapi.detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        );
        if (!detection) {
          setFaceNotDetectedCount((prev) => {
            const newCount = prev + 1;
            if (newCount <= 3) {
              alert(`⚠️ Warning ${newCount}: Face not detected!`);
            }
            if (newCount >= 4) {
              alert("❌ Face not detected 4 times. Auto-submitting quiz.");
              handleSubmit();
            }
            return newCount;
          });
        }
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // 🎤 Mic monitoring
  useEffect(() => {
    startMicMonitoring(() => {
      alert("⚠️ Warning: Talking detected!");
      setVoiceWarningCount((prev) => {
        const newCount = prev + 1;
        if (newCount >= 3) {
          alert("❌ You talked 3 times. Auto-submitting quiz.");
          handleSubmit();
        }
        return newCount;
      });
    });
  }, []);

  // 🧠 Tab switching detection
  useEffect(() => {
    const handleTabChange = () => {
      if (document.hidden) {
        alert("⚠️ Warning: You switched tabs!");
        setTabWarningCount((prev) => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            alert("❌ You switched tabs 3 times. Auto-submitting quiz.");
            handleSubmit();
          }
          return newCount;
        });
      }
    };
    document.addEventListener("visibilitychange", handleTabChange);
    return () => {
      document.removeEventListener("visibilitychange", handleTabChange);
    };
  }, []);

  // ⏱️ Timer countdown
  useEffect(() => {
    if (timer > 0 && !showResult) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && !showResult) {
      alert("⏰ Time's up! Auto-submitting quiz.");
      handleSubmit();
    }
  }, [timer, showResult]);

  const handleOptionChange = (e) => {
    setSelectedOptions({
      ...selectedOptions,
      [currentQuestion]: e.target.value,
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSubmit = () => {
    let count = 0;
    questions.forEach((q, index) => {
      if (selectedOptions[index] === q.answer) {
        count++;
      }
    });
    setScore(count);
    setShowResult(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  const formatTime = (t) => {
    const min = Math.floor(t / 60);
    const sec = t % 60;
    return `${min}m ${sec < 10 ? '0' : ''}${sec}s`;
  };

  const currentQ = questions[currentQuestion];

  if (showResult) {
    return (
      <div className="quiz-container">
        <h2>✅ Quiz Completed</h2>
        <p>🎯 Score: {score} / {questions.length}</p>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <video
        ref={videoRef}
        autoPlay
        muted
        width="200"
        height="150"
        style={{ border: "1px solid black", position: "absolute", top: "10px", right: "10px" }}
      />
      <button
        onClick={handleLogout}
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          padding: '10px 20px',
          backgroundColor: '#f44336',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Logout
      </button>

      <h3 className="timer">⏱️ Time Left: {formatTime(timer)}</h3>
      <h4 className="question-box">Q{currentQuestion + 1}: {currentQ.question}</h4>
      <div className="options">
        {currentQ.options.map((option, i) => (
          <label key={i} className="option">
            <input
              type="radio"
              value={option}
              checked={selectedOptions[currentQuestion] === option}
              onChange={handleOptionChange}
            />
            {option}
          </label>
        ))}
      </div>
      <br />
      {currentQuestion < questions.length - 1 ? (
        <button className="option-button" onClick={handleNext}>Next</button>
      ) : (
        <button className="option-button" onClick={handleSubmit}>Submit</button>
      )}
    </div>
  );
};

export default Quiz;
