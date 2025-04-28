/* Global styles */
body {
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f7f7f8;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  overflow: hidden;
}

.container {
  width: 100%;
  max-width: 1200px;
  padding: 20px;
}

/* Chatbox and message styles */
.chat-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  max-width: 600px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  height: 500px;
  overflow-y: auto;
}

.chat-message {
  padding: 12px;
  margin: 5px;
  border-radius: 8px;
  max-width: 80%;
}

.user-message {
  background-color: #007bff;
  color: white;
  align-self: flex-start;
}

.bot-message {
  background-color: #f1f1f1;
  color: #333;
  align-self: flex-end;
}

.chat-box {
  display: flex;
  flex-direction: column;
  width: 100%;
}

#send-btn {
  display: inline-block;
  margin-top: 10px;
  text-align: center;
}

input#user-input {
  width: calc(100% - 100px);
  margin-right: 10px;
}

#chat-box {
  overflow-y: auto;
  height: 80%;
}

/* Search Bar Styles */
.search-bar {
  padding: 10px;
  width: 100%;
  margin: 20px 0;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
  background-color: #ffffff;
}

.search-bar:focus {
  outline: none;
  border-color: #007bff;
}

/* Code Block Styling */
pre {
  background-color: #2d2d2d;
  color: #f8f8f2;
  padding: 15px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 14px;
  font-family: 'Courier New', Courier, monospace;
  white-space: pre-wrap;
}

code {
  color: #f8f8f2;
  font-family: 'Courier New', Courier, monospace;
}

button.copy-btn {
  background-color: #28a745;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button.copy-btn:hover {
  background-color: #218838;
}

/* Sidebar Styling */
.sidebar {
  width: 200px;
  background-color: #ffffff;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  padding: 20px;
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sidebar .chat-item {
  padding: 10px;
  margin: 10px 0;
  background-color: #f1f1f1;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.sidebar .chat-item:hover {
  background-color: #007bff;
  color: white;
}

/* Upgrade Button Styles */
.upgrade-button {
  text-align: center;
  margin-top: 20px;
  font-size: 18px;
}

.upgrade-button a {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}
