import React, { useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import './FaceDetection.css';

function FaceDetection({ onAutoSubmit }) {
  const videoRef = useRef();
  const faceMissesRef = useRef(0);
  const multipleFacesRef = useRef(0);
  const totalWarningsRef = useRef(0);

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      } catch (err) {
        console.error('Camera not accessible', err);
      }
    };

    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    };

    let intervalId;

    const handleVideoPlay = () => {
      intervalId = setInterval(async () => {
        const detections = await faceapi.detectAllFaces(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        );

        if (!detections || detections.length === 0) {
          faceMissesRef.current++;
          totalWarningsRef.current++;
          if (faceMissesRef.current <= 3) {
            alert(`⚠️ Warning ${totalWarningsRef.current}/3: Face not detected!`);
          }
        } else if (detections.length > 1) {
          multipleFacesRef.current++;
          totalWarningsRef.current++;
          if (multipleFacesRef.current <= 3) {
            alert(`⚠️ Warning ${totalWarningsRef.current}/3: Multiple faces detected!`);
          }
        } else {
          faceMissesRef.current = 0;
          multipleFacesRef.current = 0;
        }

        if (totalWarningsRef.current >= 3 && onAutoSubmit) {
          alert('❌ Cheating detected 3 times! Auto-submitting...');
          onAutoSubmit();
          clearInterval(intervalId);
        }
      }, 4000);
    };

    startVideo();
    loadModels();

    const videoEl = videoRef.current;
    if (videoEl) videoEl.addEventListener('play', handleVideoPlay);

    return () => {
      if (videoEl) videoEl.removeEventListener('play', handleVideoPlay);
      clearInterval(intervalId);
    };
  }, [onAutoSubmit]);

  return (
    <div className="face-video-container">
      <video ref={videoRef} autoPlay muted width="300" height="200" />
    </div>
  );
}

export default FaceDetection;
