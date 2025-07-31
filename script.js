// Step 1: Face-api models load karna
async function loadModels() {
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
  startWebcam(); // webcam start karein jab models load ho jayein
}
