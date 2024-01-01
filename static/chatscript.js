const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
var chatInput = document.querySelector(".chat-input textarea");
//const sendChatBtn = document.querySelector(".chat-input span");
const sendChatBtn = document.getElementById("send-btn1");
const synth = window.speechSynthesis;
var lang="en-US"

let userMessage = null; 
const inputInitHeight = chatInput.scrollHeight;

function showOverlay() {
    // Create a hidden input element of type file
    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*'; // Restrict to image files
    fileInput.style.display = 'none';
  
    // Trigger the file input when clicked
    fileInput.addEventListener('change', function () {
      if (fileInput.files.length > 0) {
        var file = fileInput.files[0];
  
        // Generate a timestamped filename
        var timestamp = new Date().getTime();
        var fileName = 'image_' + timestamp + '.' + getFileExtension(file.name);
  
        // Print the filename
        console.log(fileName);
  
        // Send the file to FastAPI
        sendFileToFastAPI(file, fileName);
      }
    });
  
    // Trigger the click event on the hidden file input
    fileInput.click();
  }
  
  function sendFileToFastAPI(file, fileName) {
    // Create a FormData object to send the file
    var formData = new FormData();
    formData.append('file', file, fileName);
  
    // Make a fetch request to the FastAPI server
    fetch('/upload', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        chatInput.value="";
        // Handle the response from the server
        console.log('Server response:', data);
        // Use the received file data as user input
        userMessage = data.response;

        chatInput.value=userMessage;
      })
      .catch(error => {
        console.error('Error sending file to server:', error);
      });
  }
  
  function getFileExtension(filename) {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  }
const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">psychology</span><p></p>`;
    chatLi.innerHTML = chatContent;  
    chatLi.querySelector("p").textContent = message;
    return chatLi; 
}

const generateResponse = (chatElement) => {
    const API_URL = "/chat/";
    const messageElement = chatElement.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ user_input: userMessage })
    };

    fetch(API_URL, requestOptions)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            console.log(data.buttons);

            messageElement.textContent = data.response;

            voiceControl(data.response);

            if (data.buttons && data.buttons.length > 0) {
                const buttonsDiv = document.createElement("div");
                buttonsDiv.classList.add("response-buttons");
                data.buttons.forEach((buttonText) => {
                    const button = document.createElement("button");
                    button.textContent = buttonText;
                    button.addEventListener("click", () => handleButtonClick(buttonText));
                    button.classList.add("button");

                    buttonsDiv.appendChild(button);
                });

                chatbox.appendChild(buttonsDiv);
            }
        })
        .catch(() => {
            messageElement.classList.add("error");
            messageElement.textContent = "Sorry, I can't get you";
        })
        .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};

/// ...

// Function to handle button click
const handleButtonClick = (buttonText) => {
    // Send the button text as user input to the bot
    userMessage = buttonText;

    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    // Display "Thinking..." message while waiting for the response
    const incomingChatLi = createChatLi("Thinking...", "incoming");
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);

    // Generate response based on the button click
    generateResponse(incomingChatLi);
};


function voiceControl(product) {
    let u = new SpeechSynthesisUtterance(product);
    u.text = product;
    u.lang = "hi-IND";
    u.volume = 1;
    u.rate = 1.2;
    u.pitch = 1;
    synth.speak(u);
}

const handleChat = () => {
    userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
    console.log(userMessage);
    if(!userMessage) return;

    // Clear the input textarea and set its height to default
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    setTimeout(() => {
        // Display "Thinking..." message while waiting for the response
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}


chatInput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If Enter key is pressed without Shift key and the window 
    // width is greater than 800px, handle the chat
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));


function toggleListening() {
    var microphoneIcon = document.getElementById('microphoneIcon');
    microphoneIcon.classList.toggle('listening');
    var icon = microphoneIcon.querySelector('i');
    icon.style.transform = microphoneIcon.classList.contains('listening') ? 'scale(1.1)' : 'scale(1)';
  
    // Play audio when listening
    var audio = document.getElementById('audio');
    if (microphoneIcon.classList.contains('listening')) {
      audio.play();
    } else {
      audio.pause();
      audio.currentTime = 0; // Reset audio to the beginning
    }
  }
 
  const reco = new webkitSpeechRecognition() || new SpeechRecognition();
  reco.interimResults = false;
  reco.maxAlternatives = 1;
  
  function toggleVoiceRecording() {
      // Start recognition
      reco.start();
  
      // Event listener for when speech recognition is complete
      reco.onresult = (event) => {
          const speechToText = event.results[0][0].transcript.trim();
          console.log('Recognized Speech:', speechToText);
  
          // Update userMessage with the recognized speech
          userMessage = speechToText;
  
          // Clear the input field
          chatInput.value = "";
  
          // Append the user's message to the chatbox
          chatbox.appendChild(createChatLi(userMessage, "outgoing"));
          chatbox.scrollTo(0, chatbox.scrollHeight);
  
          // Close recognition
          reco.stop();
  
          // Generate response based on the recognized speech
          setTimeout(() => {
              const incomingChatLi = createChatLi("Thinking...", "incoming");
              chatbox.appendChild(incomingChatLi);
              chatbox.scrollTo(0, chatbox.scrollHeight);
              generateResponse(incomingChatLi);
          }, 600);
      };
  }
  
  // Set language dynamically based on the user's preferred language
  function setRecognitionLanguage() {
      // Example: Determine user's language preference (you can use your own logic)
      const userLanguagePreference = lang; // 'en' for English, 'hi' for Hindi
      console.log(userLanguagePreference==='hi' ? 'hi-IN' : 'en-US')
      // Set recognition language
      reco.lang = userLanguagePreference === 'hi' ? 'hi-IN' : 'en-US';
  }
  
  // Set the recognition language initially
  setRecognitionLanguage();
  
  const voiceRecordBtn = document.getElementById('voiceRecordBtn');
  voiceRecordBtn.addEventListener('click', () => {
      // Set the recognition language before starting
      setRecognitionLanguage();
      toggleVoiceRecording();
  });

// Assuming you have a common parent element for these buttons, you can use event delegation.
function static(usermessage){
    handleButtonClick(usermessage);
}
document.addEventListener('click', function(event) {
    const clickedElement = event.target;

    // Check if the clicked element is a button with the custom class
    if (clickedElement.classList.contains('custom-button')) {
        // Extract the data-value attribute
        const buttonValue = clickedElement.getAttribute('data-value');

        // Now you can use the buttonValue in your generateResponse function
        // For example:
        userMessage = buttonValue;
        handleButtonClick(userMessage);
    }
});

 

  