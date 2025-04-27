const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

async function sendMessage() {
  const message = userInput.value.trim();
  if (message === "") return;

  // Add user's message to chat
  addMessage(message, 'user-message');
  userInput.value = "";

  // Send message to Grog AI API
  try {
    const response = await fetch('https://api.grog.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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'
      },
      body: JSON.stringify({
        model: "grog-gpt-3.5-turbo",
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await response.json();
    const botReply = data.choices[0].message.content;
    addMessage(botReply, 'bot-message');

  } catch (error) {
    console.error('Error:', error);
    addMessage("Error: Could not connect to AI.", 'bot-message');
  }
}

function addMessage(text, className) {
  const messageElement = document.createElement('div');
  messageElement.className = `message ${className}`;
  messageElement.textContent = text;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight; // Scroll to bottom
}
