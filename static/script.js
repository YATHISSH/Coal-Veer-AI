const chatContent = document.getElementById('chat-content');
const userInput = document.getElementById('user-input');

function addMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.innerText = message;
    chatContent.appendChild(messageElement);
}

function sendMessage() {
    const userMessage = userInput.value;
    addMessage('user', userMessage);

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
        addMessage('bot', botResponse);
    });

    userInput.value = '';
}