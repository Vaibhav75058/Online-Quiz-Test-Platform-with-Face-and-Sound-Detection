export function startMicMonitoring(onVoiceDetected) {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      const dataArray = new Uint8Array(analyser.fftSize);

      microphone.connect(analyser);

      const detect = () => {
        analyser.getByteTimeDomainData(dataArray);
        let total = 0;
        for (let i = 0; i < dataArray.length; i++) {
          total += Math.abs(dataArray[i] - 128);
        }
        const average = total / dataArray.length;

        if (average > 60) {  // Sensitivity threshold
          onVoiceDetected();
        }
        requestAnimationFrame(detect);
      };

      detect();
    })
    .catch(err => {
      console.error("Microphone access denied:", err);
    });
}
