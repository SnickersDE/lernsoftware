let username = '';

function setUsername() {
  username = prompt("Wähle einen Nutzernamen:");
  if (!username) {
    username = "Gast" + Math.floor(Math.random() * 1000);
  }
  loadMessages();
}

function sendMessage() {
  if (!username) setUsername();
  const input = document.getElementById('chat-input');
  const message = input.value;
  if (message.trim() !== '') {
    fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, message })
    })
    .then(response => response.json())
    .then(() => {
      input.value = '';
      loadMessages();
    });
  }
}

function loadMessages() {
  fetch('/chat')
    .then(response => response.json())
    .then(data => {
      const messagesDiv = document.getElementById('messages');
      messagesDiv.innerHTML = '';
      data.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        const userDiv = document.createElement('div');
        userDiv.classList.add('username');
        userDiv.textContent = msg.username;
        messageDiv.appendChild(userDiv);
        const textDiv = document.createElement('div');
        textDiv.textContent = msg.message;
        messageDiv.appendChild(textDiv);
        messagesDiv.appendChild(messageDiv);
      });
    });
}

function uploadFile() {
  const file = document.getElementById('fileUpload').files[0];
  const schwerpunkt = document.getElementById('upload-schwerpunkt').value;
  if (file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('schwerpunkt', schwerpunkt);

    fetch('/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(() => loadFiles(schwerpunkt));
  }
}

function loadFiles(schwerpunkt) {
  fetch('/files?schwerpunkt=' + schwerpunkt)
    .then(response => response.json())
    .then(files => {
      const fileList = document.getElementById('fileList');
      fileList.innerHTML = '';
      files.forEach(file => {
        const listItem = document.createElement('li');
        listItem.textContent = file.name;
        const downloadBtn = document.createElement('span');
        downloadBtn.classList.add('download');
        downloadBtn.textContent = '↓';
        downloadBtn.onclick = () => openPDF(file);
        listItem.appendChild(downloadBtn);
        fileList.appendChild(listItem);
      });
    });
}

function openPDF(file) {
  const modal = document.getElementById('pdfModal');
  const viewer = document.getElementById('pdfViewer');
  viewer.src = file.url;
  modal.style.display = 'block';
}

document.querySelector('.close').onclick = () => {
  document.getElementById('pdfModal').style.display = 'none';
};
