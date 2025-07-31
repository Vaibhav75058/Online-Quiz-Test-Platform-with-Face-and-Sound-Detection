const startMicMonitoring = (onDetect) => {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      const data = new Uint8Array(analyser.frequencyBinCount);

      source.connect(analyser);

      const checkVolume = () => {
        analyser.getByteFrequencyData(data);
        const volume = data.reduce((a, b) => a + b, 0) / data.length;

        if (volume > 60) {
          onDetect(); // talking detected
        }

        requestAnimationFrame(checkVolume);
      };

      checkVolume();
    })
    .catch(err => {
      console.error("Microphone access denied:", err);
    });
};

export default startMicMonitoring;
