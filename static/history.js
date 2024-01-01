document.addEventListener('DOMContentLoaded', function () {
    const chatbotToggler = document.querySelector(".chatbot-toggler");
    const closeBtn = document.querySelector(".close-btn");
    const chatbox = document.querySelector(".chatbox");
    const chatInput = document.querySelector(".chat-input textarea");
    const sendChatBtn = document.querySelector(".chat-input span");
  
    let userMessage = null; // Variable to store user's message
    const inputInitHeight = chatInput.scrollHeight;
  
    // -------------------Speech end--------------
    // ------------------------Send voice message to Rasa by atchayaa------
  
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
    
  
    const fetchAndDisplayChatHistory = () => {
      fetch('http://localhost:8000/hist/', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          // Assuming 'user' is a variable containing the user information
          body: JSON.stringify({ message: "Good" }),
      })
      .then(response => response.json())
      .then(data => {
          // Handle the received data
          console.log(data);
          // Display the chat history on the page
          displayChatHistory(data);
      })
      .catch(error => {
          console.error('Error fetching chat history:', error);
      });
  };

  // Example function to display chat history on the page
  const displayChatHistory = (historyData) => {
      const chatbox = document.querySelector(".chatbox");
      for (const entry of historyData) {
          const userMessage = entry.user_input;
          const botMessage = entry.bot_output;
          displayChatMessage('User', userMessage);
          displayChatMessage('Bot', botMessage);
      }
  };

  // Call the function to fetch and display chat history when the page loads
  fetchAndDisplayChatHistory();
  
    const handleChat = () => {
      userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
      if (!userMessage) return;
  
      // Clear the input textarea and set its height to default
      chatInput.value = "";
      chatInput.style.height = `${inputInitHeight}px`;
  
      // Append the user's message to the chatbox
      displayChatMessage('User', userMessage);
  
      // Generate and display bot's ressponse
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
  

function deletehis(){
  fetch('http://localhost:8000/hist/', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          // Assuming 'user' is a variable containing the user information
          body: JSON.stringify({ message: 0 }),
      })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        window.location.reload(true);
      })
      .catch(error => {
          console.error('Error fetching chat history:', error);
      });
}