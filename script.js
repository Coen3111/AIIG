// Google Sign-In (using OAuth)
function onSignIn(googleUser) {
  const profile = googleUser.getBasicProfile();
  const email = profile.getEmail();
  const name = profile.getName();
  const picture = profile.getImageUrl();
  
  localStorage.setItem('userEmail', email);
  localStorage.setItem('userName', name);
  localStorage.setItem('profilePicture', picture);

  window.location.href = 'chat.html';
}

// Sign Up and Login (regular)
function signup() {
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const name = document.getElementById('profile-name').value;
  const picture = document.getElementById('profile-picture').files[0];

  if (email && password && name) {
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userPassword', password);
    localStorage.setItem('userName', name);
    localStorage.setItem('profilePicture', picture ? URL.createObjectURL(picture) : 'default.jpg');
    alert('Account created!');
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
    window.location.href = 'chat.html';
  } else {
    alert('Invalid credentials!');
  }
}

function logout() {
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  localStorage.removeItem('profilePicture');
  window.location.href = 'login.html';
}

// On Chat Page
window.onload = function () {
  const name = localStorage.getItem('userName');
  const picture = localStorage.getItem('profilePicture');
  const email = localStorage.getItem('userEmail');

  document.getElementById('user-name').textContent = name;
  document.getElementById('profile-img').src = picture;

  // Load previous chats
  const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
  const chatHistoryList = document.getElementById('chat-history');
  chatHistory.forEach(chat => {
    const li = document.createElement('li');
    li.textContent = chat;
    chatHistoryList.appendChild(li);
  });
};
