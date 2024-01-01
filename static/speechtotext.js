let mediaRecorder;
        let chunks = [];
        let isRecording = false;

        const recordButton = document.getElementById('recordButton');

        recordButton.addEventListener('click', toggleRecording);

        async function toggleRecording() {
            if (!isRecording) {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        chunks.push(event.data);
                    }
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(chunks, { type: 'audio/wav' });
                    const formData = new FormData();
                    formData.append('audio', audioBlob, 'unique_filename.wav');

                    // Send the Blob to the server using Fetch or another method
                    fetch('/uploadfile/', {
                        method: 'POST',
                        body: formData
                    });

                    // Reset chunks for the next recording
                    chunks = [];
                };

                mediaRecorder.start();
                isRecording = true;
                //recordButton.textContent = 'Stop Recording';
            } else {
                mediaRecorder.stop();
                isRecording = false;
                //recordButton.textContent = 'Start Recording';
            }
        }