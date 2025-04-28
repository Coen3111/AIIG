// --- Configuration ---
const GROQ_API_KEY = "YOUR_GROQ_API_KEY_HERE"; // 🔥 Replace with your real Groq API key
const BASE_BEHAVIOR = "You are a helpful, smart, friendly assistant like ChatGPT.";
let chats = [];

// --- DOM Ready ---
document.addEventListener('DOMContentLoaded', () => {
    setupForms();
    if (document.getElementById('chatForm')) {
        loadChats();
    }
});

// --- Setup all forms ---
function setupForms() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const settingsForm = document.getElementById('settingsForm');
    const chatForm = document.getElementById('chatForm');

    if (signupForm) signupForm.addEventListener('submit', handleSignup);
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (settingsForm) settingsForm.addEventListener('submit', handleSettingsSave);
    if (chatForm) chatForm.addEventListener('submit', handleChatSubmit);
}

// --- Signup ---
function handleSignup(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;

    localStorage.setItem('user', JSON.stringify({ email, password }));
    alert('Account created! You can now login.');
    window.location.href = 'index.html';
}

// --- Login ---
function handleLogin(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;
    const savedUser = JSON.parse(localStorage.getItem('user'));

    if (savedUser && savedUser.email === email && savedUser.password === password) {
        window.location.href = 'chat.html';
    } else {
        alert('Invalid email or password.');
    }
}

// --- Settings Save ---
function handleSettingsSave(e) {
    e.preventDefault();
    const behavior = document.getElementById('aiBehavior').value;
    localStorage.setItem('aiBehavior', behavior);
    alert('Settings saved!');
}

// --- Chat Submit ---
async function handleChatSubmit(e) {
    e.preventDefault();
    const input = document.getElementById('userInput');
    const userMessage = input.value.trim();
    if (!userMessage) return;

    addMessage('user', userMessage);
    input.value = '';

    const behavior = localStorage.getItem('aiBehavior') || BASE_BEHAVIOR;
    const aiReply = await getAIResponse(behavior, userMessage);

    addMessage('ai', aiReply);
}

// --- Add a Message ---
function addMessage(role, content) {
    const chatBox = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = role === 'user' ? 'user-message' : 'ai-message';

    if (content.includes('```')) {
        const codeContent = content.split('```')[1];
        messageDiv.innerHTML = `
            <div class="code-block">
                <button class="copy-btn" onclick="copyToClipboard(this)">Copy</button>
                <pre>${codeContent}</pre>
            </div>
        `;
    } else {
        messageDiv.textContent = content;
    }

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    chats.push({ role, content });
    localStorage.setItem('chats', JSON.stringify(chats));
}

// --- Copy code block ---
function copyToClipboard(button) {
    const code = button.parentElement.querySelector('pre').innerText;
    navigator.clipboard.writeText(code)
        .then(() => {
            button.textContent = "Copied!";
            setTimeout(() => { button.textContent = "Copy"; }, 2000);
        });
}

// --- Load old chats ---
function loadChats() {
    const savedChats = JSON.parse(localStorage.getItem('chats')) || [];
    chats = savedChats;
    chats.forEach(chat => addMessage(chat.role, chat.content));
}

// --- Start new chat ---
function newChat() {
    chats = [];
    localStorage.removeItem('chats');
    document.getElementById('chatMessages').innerHTML = '';
}

// --- Fetch real AI response from Groq ---
async function getAIResponse(systemPrompt, userPrompt) {
    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama3-70b-8192',
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ]
            })
        });

        if (!response.ok) {
            throw new Error('Error from AI API');
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error(error);
        return "⚠️ Error contacting AI server. Try again.";
    }
}
