//const synth = window.speechSynthesis;

/*function addChat(input, product) {
    const mainDiv = document.getElementById("message-section");
    let userDiv = document.createElement("div");
    userDiv.id = "user";
    userDiv.classList.add("message");
    userDiv.innerHTML = `<span id="user-response">${input}</span>`;
    mainDiv.appendChild(userDiv);
  
    let botDiv = document.createElement("div");
    botDiv.id = "bot";
    botDiv.classList.add("message");
    botDiv.innerHTML = `<span id="bot-response">${product}</span>`;
    mainDiv.appendChild(botDiv);
    var scroll = document.getElementById("message-section");
    scroll.scrollTop = scroll.scrollHeight;
    //voiceControl(product);
    let u = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    u.text = product;
    u.voice=voices[4]
    u.voiceURI="Microsoft Zira - English (United States)"
    u.lang = "en-US";
    u.volume = 1;
    u.rate = 1;
    u.pitch = 1;
    synth.speak(u);
    }*/
    function sendMessage2(input) {
        //addMessage('user', userMessage)
        console.log(input)
        // Send user input to FastAPI backend
        fetch('/chat1/', {
            method: 'POST',
            body: new URLSearchParams({ user_input: String(input) }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
        .then((response) => response.json())
        .then((data) => {
            const botResponse = data.response;
            console.log(botResponse)
            addChat(input, botResponse);
        });
      
        userInput.value = '';
      }
function showCameraCapture(event) {
    // Stop the propagation of the click event
    event.stopPropagation();

    var overlay = document.getElementById("overlay");
    overlay.style.display = "flex";

    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(error => {
            console.error('Error accessing camera:', error);
        });
}


function captureImage() {
            const video = document.getElementById('video');
            const canvas = document.getElementById('canvas');
            const context = canvas.getContext('2d');

            const fileInput = document.getElementById('fileInput');
            const file = fileInput.files[0];

            if (file) {
                // If a file is selected, use the file for conversion
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const reader = new FileReader();

                reader.onload = function (e) {
                    const img = new Image();
                    img.onload = function () {
                        context.drawImage(img, 0, 0, canvas.width, canvas.height);
                        const imageData = canvas.toDataURL('image/png');
                        convertImageToText(imageData);

                        // Close the camera capture overlay
                        var overlay = document.getElementById("overlay");
                        overlay.style.display = "none";
                    };
                    img.src = e.target.result;
                };

                reader.readAsDataURL(file);
            } else {
                // If no file is selected, capture from camera
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Convert captured image to text using Tesseract.js
                const imageData = canvas.toDataURL('image/png');
                convertImageToText(imageData);

                // Close the camera capture overlay
                var overlay = document.getElementById("overlay");
                overlay.style.display = "none";
            }
        }

        async function convertImageToText(imageData) {
            try {
                const { data: { text } } = await Tesseract.recognize(imageData, 'eng');
                console.log('Captured Image Text:', text);
                sendMessage2(text);

                // Now you can use the 'text' variable as needed (e.g., display it on the UI).
            } catch (error) {
                console.error('Error converting image to text:', error);
            }
        }

        // Event listener to close the overlay when clicking away
        document.body.addEventListener('click', (event) => {
            const overlay = document.getElementById('overlay');
            if (!overlay.contains(event.target)) {
                overlay.style.display = 'none';
            }
        });

        document.addEventListener('DOMContentLoaded', () => {
            const input = document.getElementById('input');
            const messageSection = document.getElementById('message-section');
            const botResponse = document.getElementById('bot-response');
            // Define other functions or event listeners as needed
        });