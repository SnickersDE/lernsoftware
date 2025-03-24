let username = '';
let ratings = {}; // Objekt zur Speicherung der Bewertungen der PDFs

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
// Funktion, um die PDFs und deren Bewertungen zu laden
function loadFiles(schwerpunkt) {
    fetch(`/files?schwerpunkt=${schwerpunkt}`)
        .then(response => response.json())
        .then(files => {
            const fileList = document.getElementById('fileList');
            fileList.innerHTML = '';  // Clear the list before adding new files

            files.forEach(file => {
                const listItem = document.createElement('li');
                listItem.classList.add('file-item');
                
                // Datei-Name anzeigen
                const fileName = document.createElement('span');
                fileName.textContent = file.name;
                listItem.appendChild(fileName);

                // Bewertungen hinzufügen (Sterne)
                const starContainer = document.createElement('div');
                starContainer.classList.add('star-container');
                
                // Bestehende Bewertungen für die Datei abrufen (falls vorhanden)
                const ratings = file.ratings || [];
                for (let i = 1; i <= 5; i++) {
                    const star = document.createElement('span');
                    star.classList.add('star');
                    star.dataset.rating = i;
                    star.innerHTML = '&#9733;'; // Sternsymbol

                    // Sterne je nach Bewertung auffüllen
                    if (ratings.includes(i)) {
                        star.classList.add('filled');
                    }

                    // Event-Listener zum Setzen einer neuen Bewertung
                    star.onclick = () => rateFile(file, i);
                    starContainer.appendChild(star);
                }

                // Die Sterne unter dem Dateinamen hinzufügen
                listItem.appendChild(starContainer);

                // Die Liste der Dateien (PDFs) mit Bewertungen anzeigen
                fileList.appendChild(listItem);
            });
        });
}

// Bewertungs-Funktion (Sendet die Bewertung an den Server)
function rateFile(file, rating) {
    fetch('/rate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fileName: file.name, rating })
    })
    .then(response => response.json())
    .then(() => {
        // Nach der Bewertung die Liste der Dateien neu laden
        loadFiles(file.schwerpunkt);
    });
}

// Funktion, um die Lernstoff-Schwerpunkte zu laden
function loadSchwerpunkte() {
    fetch('/schwerpunkte')
        .then(response => response.json())
        .then(schwerpunkte => {
            const schwerpunkteList = document.getElementById('schwerpunkteList');
            schwerpunkteList.innerHTML = '';

            schwerpunkte.forEach(schwerpunkt => {
                const button = document.createElement('button');
                button.textContent = schwerpunkt.name;
                button.onclick = () => loadFiles(schwerpunkt.name);
                schwerpunkteList.appendChild(button);
            });
        });
}

// Event Listener für das Dropdown-Menü und die Lernstoff-Schwerpunkte
document.addEventListener('DOMContentLoaded', () => {
    loadSchwerpunkte(); // Lernstoff-Schwerpunkte laden, wenn die Seite geladen wird
});

function loadFiles(schwerpunkt) {
  fetch('/files?schwerpunkt=' + schwerpunkt)
    .then(response => response.json())
    .then(files => {
      const fileList = document.getElementById('fileList');
      fileList.innerHTML = '';
      files.forEach(file => {
        const listItem = document.createElement('li');
        listItem.textContent = file.name;
        
        // Bewertungssterne hinzufügen
        const starContainer = document.createElement('span');
        starContainer.classList.add('stars');
        for (let i = 1; i <= 5; i++) {
          const star = document.createElement('span');
          star.classList.add('star');
          star.dataset.rating = i;
          star.innerHTML = '&#9733;'; // Sternsymbol
          star.onclick = () => rateFile(file, i);
          if (ratings[file.name] && ratings[file.name] >= i) {
            star.classList.add('filled');
          }
          starContainer.appendChild(star);
        }

        // Download-Button hinzufügen
        const downloadBtn = document.createElement('span');
        downloadBtn.classList.add('download');
        downloadBtn.textContent = '↓';
        downloadBtn.onclick = () => openPDF(file);
        listItem.appendChild(starContainer);
        listItem.appendChild(downloadBtn);
        fileList.appendChild(listItem);
      });
    });
}

function rateFile(file, rating) {
  // Speichern der Bewertung
  ratings[file.name] = rating;
  loadFiles(file.schwerpunkt); // Die Dateien erneut laden, um die Bewertung zu aktualisieren
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
