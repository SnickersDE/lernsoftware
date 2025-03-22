let username = '';
function setUsername() {
    username = prompt("Wähle einen Nutzernamen:");
    if (!username) {
        username = "Gast" + Math.floor(Math.random() * 1000);
    }
}

function sendMessage() {
    if (!username) setUsername();
    const input = document.getElementById('chat-input');
    const message = input.value;
    if (message.trim() !== '') {
        const messagesDiv = document.getElementById('messages');
        const newMessage = document.createElement('div');
        newMessage.classList.add('message');

        const userSpan = document.createElement('div');
        userSpan.classList.add('username');
        userSpan.textContent = username;

        const textSpan = document.createElement('div');
        textSpan.textContent = message;

        newMessage.appendChild(userSpan);
        newMessage.appendChild(textSpan);
        messagesDiv.appendChild(newMessage);

        input.value = '';
    }
}

function uploadFile() {
    const fileInput = document.getElementById('fileUpload');
    const fileList = document.getElementById('fileList');
    if (fileInput.files.length > 0) {
        const fileName = fileInput.files[0].name;
        const listItem = document.createElement('li');
        listItem.textContent = fileName;
        fileList.appendChild(listItem);
    }
}

window.onload = setUsername;
