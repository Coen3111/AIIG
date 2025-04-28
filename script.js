const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

if (sendBtn) {
  sendBtn.addEventListener('click', sendMessage);
  userInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (message === "") return;

  addMessage(message, 'user-message');
  userInput.value = "";

  addMessage("Thinking...", 'bot-message', true);

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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'
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [{ role: "user", content: message }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      updateLastBotMessage(`Error: ${errorData.error?.message || 'Unknown error'}`);
      return;
    }

    const data = await response.json();
    const botReply = data.choices[0].message.content;
    updateLastBotMessage(botReply);

  } catch (error) {
    console.error('Network Error:', error);
    updateLastBotMessage("Network error: Could not connect to AI.");
  }
}

function addMessage(text, className, isLoading = false) {
  const messageElement = document.createElement('div');
  messageElement.className = `message ${className}`;

  if (className === 'bot-message') {
    const aiName = document.createElement('strong');
    aiName.textContent = 'Groq AI: ';
    messageElement.appendChild(aiName);
  }

  if (text.includes("```")) {
    const codeBlock = document.createElement('pre');
    const codeContent = text.replace(/```/g, "");
    codeBlock.className = 'code-block';
    codeBlock.textContent = codeContent;
    messageElement.appendChild(codeBlock);

    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.textContent = 'Copy Code';
    copyBtn.onclick = () => copyToClipboard(codeContent);
    messageElement.appendChild(copyBtn);
  } else {
    messageElement.textContent += text;
  }

  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function updateLastBotMessage(newText) {
  const messages = document.querySelectorAll('.bot-message');
  const lastBot = messages[messages.length - 1];
  if (lastBot) lastBot.textContent = newText;
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert("Code copied to clipboard!");
  }).catch(err => {
    console.error("Error copying code: ", err);
  });
}
