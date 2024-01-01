/*const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; // Variable to store user's message
const API_KEY = "PASTE-YOUR-API-KEY"; // Paste your API key here
//const RASA_API_URL = "http://localhost:5005/webhooks/rest/webhook";
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // return chat <li> element
}

const generateResponse = (chatElement) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = chatElement.querySelector("p");

    // Define the properties and message for the API request
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: userMessage}],
        })
    }

    

    // Send POST request to API, get response and set the reponse as paragraph text
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content.trim();
    }).catch(() => {
        messageElement.classList.add("error");
        messageElement.textContent = "Hello,How are You";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}


const handleChat = () => {
    userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
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
  }*/

  //---------------------------------------------------Atchayaa's trial (Successful in UI connection)------------------------------------------------------------

  /*document.addEventListener('DOMContentLoaded', function () {
    const chatbotToggler = document.querySelector(".chatbot-toggler");
    const closeBtn = document.querySelector(".close-btn");
    const chatbox = document.querySelector(".chatbox");
    const chatInput = document.querySelector(".chat-input textarea");
    const sendChatBtn = document.querySelector(".chat-input span");
  
    let userMessage = null; // Variable to store user's message
    const RASA_API_URL = "http://localhost:5005/webhooks/rest/webhook"; // Update this with your Rasa server endpoint
    const inputInitHeight = chatInput.scrollHeight;
  
    const createChatLi = (message, className) => {
      // Create a chat <li> element with passed message and className
      const chatLi = document.createElement("li");
      chatLi.classList.add("chat", `${className}`);
      let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
      chatLi.innerHTML = chatContent;
      chatLi.querySelector("p").textContent = message;
      return chatLi; // return chat <li> element
    }
  
    const sendMessageToRasa = () => {
      fetch(RASA_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      })
        .then(response => response.json())
        .then(data => {
          // Display bot's response in the chatbox
          displayMessage('Bot', data[0].text);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  
    const generateResponse = () => {
      // Display "Thinking..." message while waiting for the response
      const incomingChatLi = createChatLi("Thinking...", "incoming");
      chatbox.appendChild(incomingChatLi);
      chatbox.scrollTo(0, chatbox.scrollHeight);
      
      // Send user's message to Rasa server
      sendMessageToRasa();
    }
  
    const displayMessage = (sender, message) => {
      const chatItem = createChatLi(message, sender === 'User' ? 'outgoing' : 'incoming');
      chatbox.appendChild(chatItem);
  
      // Scroll to the bottom of the chatbox to show the latest message
      chatbox.scrollTop = chatbox.scrollHeight;
    }
  
    const handleChat = () => {
      userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
      if(!userMessage) return;
  
      // Clear the input textarea and set its height to default
      chatInput.value = "";
      chatInput.style.height = `${inputInitHeight}px`;
  
      // Append the user's message to the chatbox
      displayMessage('User', userMessage);
  
      // Generate and display bot's response
      setTimeout(() => generateResponse(), 600);
    }
  
    chatInput.addEventListener("input", () => {
      // Adjust the height of the input textarea based on its content
      chatInput.style.height = `${inputInitHeight}px`;
      chatInput.style.height = `${chatInput.scrollHeight}px`;
    });
  
    chatInput.addEventListener("keydown", (e) => {
      // If Enter key is pressed without Shift key, handle the chat
      if(e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleChat();
      }
    });
  
    sendChatBtn.addEventListener("click", handleChat);
    closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
    chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
  });*/

  //--------------------------------------------------Atchayaa's trial 1 to trigger voice_bot-----------------------------------
  
  /*document.addEventListener('DOMContentLoaded', function () {
    const chatbotToggler = document.querySelector(".chatbot-toggler");
    const closeBtn = document.querySelector(".close-btn");
    const chatbox = document.querySelector(".chatbox");
    const chatInput = document.querySelector(".chat-input textarea");
    const sendChatBtn = document.querySelector(".chat-input span");
    const micButton = document.querySelector("#mic-button");
    const voiceBtn = document.getElementById("voice-btn");

    document.addEventListener('DOMContentLoaded', function () {
      const voiceBtn = document.getElementById("voice-btn");
  
      voiceBtn.addEventListener('click', function () {
          startVoiceRecognition();
      });
  
      const startVoiceRecognition = () => {
          const recognition = new window.SpeechRecognition();
          recognition.lang = 'en-US';
  
          recognition.onresult = (event) => {
              const userVoiceInput = event.results[0][0].transcript;
              displayMessage('User', userVoiceInput);
  
              sendMessageToRasa(userVoiceInput);
          };
  
          recognition.start();
      };
  

      const sendMessageToRasa = () => {
        fetch(RASA_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: userMessage,
            }),
        })
            .then(response => response.json())
            .then(data => {
                displayMessage('Bot', data[0].text);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
  });


    let userMessage = null;
    const RASA_API_URL = "http://localhost:5005/webhooks/rest/webhook";
    const inputInitHeight = chatInput.scrollHeight;

    const createChatLi = (message, className) => {
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat", `${className}`);
        let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
        chatLi.innerHTML = chatContent;
        chatLi.querySelector("p").textContent = message;
        return chatLi;
    }

    const sendMessageToRasa = () => {
        fetch(RASA_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: userMessage,
            }),
        })
            .then(response => response.json())
            .then(data => {
                displayMessage('Bot', data[0].text);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    const generateResponse = () => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);

        sendMessageToRasa();
    }

    const displayMessage = (sender, message) => {
        const chatItem = createChatLi(message, sender === 'User' ? 'outgoing' : 'incoming');
        chatbox.appendChild(chatItem);
        chatbox.scrollTop = chatbox.scrollHeight;
    }

    const handleChat = () => {
        userMessage = chatInput.value.trim();
        if (!userMessage) return;

        chatInput.value = "";
        chatInput.style.height = `${inputInitHeight}px`;

        displayMessage('User', userMessage);

        setTimeout(() => generateResponse(), 600);
    }

    chatInput.addEventListener("input", () => {
        chatInput.style.height = `${inputInitHeight}px`;
        chatInput.style.height = `${chatInput.scrollHeight}px`;
    });

    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleChat();
        }
    });

    sendChatBtn.addEventListener("click", handleChat);
    closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
    chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

    micButton.addEventListener('click', function () {
        triggerVoicebot();
    });

    const triggerVoicebot = () => {
        fetch('/trigger-voicebot', {
            method: 'POST',
        })
            .then(response => response.json())
            .then(data => {
                const botMessage = data.bot_message || 'No response from the bot.';
                displayMessage('Bot', botMessage);
            })
            .catch(error => {
                console.error('Error:', error);
                displayMessage('Bot', 'An error occurred while processing your request.');
            });
    };
});*/

//-------------------------------------------------------------Atchayaa's trial for voice integration---------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  const chatbotToggler = document.querySelector(".chatbot-toggler");
  const closeBtn = document.querySelector(".close-btn");
  const chatbox = document.querySelector(".chatbox");
  const chatInput = document.querySelector(".chat-input textarea");
  const sendChatBtn = document.querySelector(".chat-input span");
  const voiceBtn = document.getElementById("voice-btn");

  let userMessage = null; // Variable to store user's message
  const RASA_API_URL = "http://localhost:5005/webhooks/rest/webhook"; // Rasa server endpoint
  const inputInitHeight = chatInput.scrollHeight;

  // ----------Speech-----------
  const startSpeechRecognition = () => {
    const SpeechRecognition = window.speechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      userMessage = event.results[0][0].transcript;
      console.log("User Input:", userMessage);
      sendVoiceMessageToRasa(event.results[0][0].transcript);
      displayChatMessage('User', event.results[0][0].transcript);
    };

    recognition.start();
  };

  voiceBtn.addEventListener('click', function () {
    console.log("Voice button clicked. Starting speech recognition...");
    startSpeechRecognition();
  });
  // -------------------Speech end--------------
  // ------------------------Send voice message to Rasa by atchayaa------
  const sendVoiceMessageToRasa = (message) => {
    fetch(RASA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
      }),
    })
      .then(response => response.json())
      .then(data => {
        // Display bot's response in the chatbox
        var s='';
        for(let i=0;i<data.length;i++){
          s+=data[i].text;
        }
        displayChatMessage('Bot', s);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const displayChatMessage = (sender, message) => {
    const chatItem = createChatLi(message, sender === 'User' ? 'outgoing' : 'incoming');
    chatbox.appendChild(chatItem);
    chatbox.scrollTop = chatbox.scrollHeight;
  };

  // ------------------------Send voice message to Rasa end by atchayaa------

  const createChatLi = (message, className) => {
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // return chat <li> element
  }

  const sendMessageToRasa = () => {
    fetch(RASA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
      }),
    })
      .then(response => response.json())
      .then(data => {
        var s = ''
        for (let i = 0; i < data.length; i++) {
          s += data[i].text + '\n';
        }
        console.log(data);
        // Display bot's response in the chatbox
        displayChatMessage('Bot', s);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  const handleChat = () => {
    userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
    if (!userMessage) return;

    // Clear the input textarea and set its height to default
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append the user's message to the chatbox
    displayChatMessage('User', userMessage);

    // Generate and display bot's response
    sendMessageToRasa();
  }

  chatInput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
  });

  chatInput.addEventListener("keydown", (e) => {
    // If Enter key is pressed without Shift key, handle the chat
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleChat();
    }
  });

  sendChatBtn.addEventListener("click", handleChat);
  closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
  chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
});
//----------------for buttons
/*// Add this function to handle button clicks
const handleButtonClick = (payload) => {
  // You can extract and handle the payload here
  console.log("Button clicked with payload:", payload);

  // Add logic to handle different button payloads if needed
  if (payload === "/mining_laws") {
    handleMiningActs();
  } else if (payload === "/language_buttons") {
    handleLanguageButtons();
  } else if (payload.includes("language")) {
    // Extract language from payload and handle accordingly
    const language = payload.split('"language": "')[1].split('"')[0];
    handleLanguageSelection(language);
  } else if (payload === "/act1_button") {
    // Handle the click for Act 1 button
    handleActButtonClick("Act 1");
  } else if (payload === "/act2_button") {
    // Handle the click for Act 2 button
    handleActButtonClick("Act 2");
  }
}

// Add this function to handle mining acts button click
const handleActButtonClick = (actName) => {
  // Send a message to Rasa with the corresponding intent
  const message = `{"text": "Tell me about ${actName}"}`;
  sendToRasa(message);
}

// Add this function to send a message to Rasa
const sendToRasa = (message) => {
  fetch(RASA_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: message,
  })
    .then(response => response.json())
    .then(data => {
      // Display bot's response in the chatbox
      const botResponse = data[0].text;
      displayMessage('Bot', botResponse);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
*/