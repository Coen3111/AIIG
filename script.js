// === LOGIN / SIGNUP ===
function signup() {
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  if (email && password) {
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userPassword', password);
    alert('Account created successfully!');
    window.location.href = 'login.html';
  } else {
    alert('Please fill out all fields.');
  }
}

function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const storedEmail = localStorage.getItem('userEmail');
  const storedPassword = localStorage.getItem('userPassword');
  if (email === storedEmail && password === storedPassword) {
    alert('Login successful!');
    window.location.href = 'chat.html';
  } else {
    alert('Invalid credentials!');
  }
}

function logout() {
  window.location.href = 'login.html';
}

// === CHAT ===
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const sidebar = document.getElementById('sidebar');
const upgradeButton = document.getElementById('upgrade-btn');

let chats = [];

if (sendBtn) {
  sendBtn.addEventListener('click', sendMessage);
  userInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  loadChats();
  renderSidebar();
}

// Send Message
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

    saveChat(message, botReply);

  } catch (error) {
    console.error('Network Error:', error);
    updateLastBotMessage("Network error: Could not connect to AI.");
  }
}

// Add Message
function addMessage(text, className, isLoading = false) {
  const messageElement = document.createElement('div');
  messageElement.className = `message ${className}`;
  if (text.includes('```')) {
    // Code block
    const codeContent = text.split('```')[1];
    messageElement.innerHTML = `
      <div class="code-block">
        <button class="copy-btn" onclick="copyCode(this)">Copy</button>
        <pre>${codeContent}</pre>
      </div>
    `;
  } else {
    messageElement.textContent = text;
  }
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Update Bot Reply
function updateLastBotMessage(newText) {
  const messages = document.querySelectorAll('.bot-message');
  const lastBot = messages[messages.length - 1];
  if (lastBot) {
    if (newText.includes('```')) {
      const codeContent = newText.split('```')[1];
      lastBot.innerHTML = `
        <div class="code-block">
          <button class="copy-btn" onclick="copyCode(this)">Copy</button>
          <pre>${codeContent}</pre>
        </div>
      `;
    } else {
      lastBot.textContent = newText;
    }
  }
}

// Copy Code
function copyCode(button) {
  const code = button.parentElement.querySelector('pre').innerText;
  navigator.clipboard.writeText(code).then(() => {
    button.textContent = 'Copied!';
    setTimeout(() => { button.textContent = 'Copy'; }, 2000);
  });
}

// Save Chat
function saveChat(userMsg, botMsg) {
  chats.push({ user: userMsg, bot: botMsg });
  localStorage.setItem('chats', JSON.stringify(chats));
  renderSidebar();
}

// Load Chats from localStorage
function loadChats() {
  const savedChats = localStorage.getItem('chats');
  if (savedChats) {
    chats = JSON.parse(savedChats);
    chats.forEach(chat => {
      addMessage(chat.user, 'user-message');
      addMessage(chat.bot, 'bot-message');
    });
  }
}

// Render Sidebar Chat History
function renderSidebar() {
  sidebar.innerHTML = '';
  chats.slice(-5).reverse().forEach((chat, index) => {
    const chatItem = document.createElement('div');
    chatItem.className = 'chat-item';
    chatItem.textContent = chat.user;
    chatItem.addEventListener('click', () => {
      chatBox.innerHTML = '';
      addMessage(chat.user, 'user-message');
      addMessage(chat.bot, 'bot-message');
    });
    sidebar.appendChild(chatItem);
  });
}

if (upgradeButton) {
  upgradeButton.addEventListener('click', () => {
    window.location.href = 'upgrade.html';
  });
}
