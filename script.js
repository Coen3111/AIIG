const basePrompt = "You are a helpful assistant like ChatGPT. Be smart, clear, and helpful.";
let chats = [];

// Run when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const settingsForm = document.getElementById('settingsForm');
    const chatForm = document.getElementById('chatForm');

    // LOGIN
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('input[type="email"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;
            const savedUser = JSON.parse(localStorage.getItem('user'));

            if (savedUser && savedUser.email === email && savedUser.password === password) {
                window.location.href = 'chat.html'; // ✅ Login success
            } else {
                alert('Invalid email or password');
            }
        });
    }

    // SIGN UP
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = signupForm.querySelector('input[type="email"]').value;
            const password = signupForm.querySelector('input[type="password"]').value;

            localStorage.setItem('user', JSON.stringify({ email, password }));
            alert('Account created! You can now login.');
            window.location.href = 'index.html'; // redirect to login
        });
    }

    // SETTINGS (AI Behavior)
    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const behavior = document.getElementById('aiBehavior').value;
            localStorage.setItem('aiBehavior', behavior);
            alert('Settings saved!');
        });

        // Load saved behavior if exists
        const savedBehavior = localStorage.getItem('aiBehavior');
        if (savedBehavior) {
            document.getElementById('aiBehavior').value = savedBehavior;
        }
    }

    // CHAT
    if (chatForm) {
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = document.getElementById('userInput');
            const userMessage = input.value.trim();
            if (!userMessage) return;
            addMessage('user', userMessage);
            input.value = '';

            let behavior = localStorage.getItem('aiBehavior') || basePrompt;
            const fullPrompt = behavior + "\n\nUser: " + userMessage;

            const aiResponse = await fakeAIResponse(fullPrompt);

            addMessage('ai', aiResponse);
        });

        loadOldChats(); // Load chats when you open chat page
    }
});

// Add a message to the chat
function addMessage(role, content) {
    const chatMessages = document.getElementById('chatMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = role === 'user' ? 'user-message' : 'ai-message';

    // Handle code blocks
    if (content.includes('```')) {
        const codeContent = content.split('```')[1];
        msgDiv.innerHTML = `
            <div class="code-block">
                <button class="copy-btn" onclick="copyToClipboard(this)">Copy</button>
                <pre>${codeContent}</pre>
            </div>
        `;
    } else {
        msgDiv.textContent = content;
    }

    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Save to local storage
    chats.push({ role, content });
    localStorage.setItem('chats', JSON.stringify(chats));
}

// Copy code button
function copyToClipboard(button) {
    const code = button.parentElement.querySelector('pre').innerText;
    navigator.clipboard.writeText(code);
    button.textContent = 'Copied!';
    setTimeout(() => button.textContent = 'Copy', 2000);
}

// Load old chats from local storage
function loadOldChats() {
    const savedChats = JSON.parse(localStorage.getItem('chats')) || [];
    chats = savedChats;

    for (const chat of chats) {
        addMessage(chat.role, chat.content);
    }
}

// Create new chat
function newChat() {
    chats = [];
    localStorage.removeItem('chats');
    document.getElementById('chatMessages').innerHTML = '';
}

// Simulate AI response
async function fakeAIResponse(prompt) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("🤖 AI says: This is a fake response based on: " + prompt);
        }, 1000);
    });
}
