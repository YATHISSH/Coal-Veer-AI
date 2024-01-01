const synth = window.speechSynthesis;
  
function addChat(input, product) {
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
}
/*function voiceControl(product) {
    let u = new SpeechSynthesisUtterance(product);
    u.text = product;
    u.lang = "en-aus";
    u.volume = 1;
    u.rate = 1;
    u.pitch = 1;
    synth.speak(u);
}*/

const userInput = document.getElementById('input');

var input = document.getElementById("myInput");

// Execute a function when the user presses a key on the keyboard
document.addEventListener("DOMContentLoaded", () => {
    const inputField = document.getElementById("input");
    inputField.addEventListener("keydown", function (e) {
      if (e.code === "Enter") {
        sendMessage1();
      }
    });
  });


function sendMessage1() {
  const userMessage = userInput.value;
  //addMessage('user', userMessage);

  // Send user input to FastAPI backend
  fetch('/chat', {
      method: 'POST',
      body: new URLSearchParams({ user_input: userMessage }),
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
      },
  })
  .then((response) => response.json())
  .then((data) => {
      const botResponse = data.response;
      console.log(botResponse)
      addChat(userMessage, botResponse);
  });

  userInput.value = '';
}
