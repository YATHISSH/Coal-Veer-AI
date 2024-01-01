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
}

function clearHistory() {
  // Send a request to the server to clear history
  fetch('/hist', {
    method: "POST",
    headers: {
    "Content-Type": "application/json"
    },
  body: JSON.stringify({message:"Clear"}),
    })
      .then((response) => response.json())
      .then((data) => {
          // Clear the chat display on the front end
          document.getElementById("message-section").innerHTML = "";
      });
}

// Initial load of chat history
fetch('/hist', {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({message:"Hello"}),
})
  .then((response) => response.json())
  .then((data) => {
      const response = data;
      console.log(response)
      for (let i = 0; i < response.length; i++) {
          addChat(response[i]["user_input"], response[i]["bot_output"]);
      }
  });
