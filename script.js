const basePrompt = "You are a helpful assistant like ChatGPT. Be smart, clear, and helpful.";
let chats = [];

document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chatForm');
    if (chatForm) {
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = document.getElementById('userInput');
            const userMessage = input.value.trim();
            if (!userMessage) return;
            addMessage('user', userMessage);
            input.value = '';

            const fullPrompt = basePrompt + "\n\nUser: " + userMessage;

            // Here you call Groq or any backend you use
            const aiResponse = await fakeAIResponse(fullPrompt);

            addMessage('ai', aiResponse);
        });
    }
});

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
}

function copyToClipboard(button) {
    const code = button.parentElement.querySelector('pre').innerText;
    navigator.clipboard.writeText(code);
    button.textContent = 'Copied!';
    setTimeout(() => button.textContent = 'Copy', 2000);
}

// fake AI response
async function fakeAIResponse(prompt) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("This is a fake AI response based on your prompt: " + prompt);
        }, 1000);
    });
}

function newChat() {
    document.getElementById('chatMessages').innerHTML = '';
}
