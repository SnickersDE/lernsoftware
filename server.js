const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public')); // Damit deine statischen Dateien geladen werden

let fileRatings = {}; // Bewertungen im Speicher (für Testzwecke)

// Route für das Abrufen der Bewertungen
app.get('/ratings', (req, res) => {
  res.json(fileRatings);
});

// Route für das Hinzufügen einer Bewertung
app.post('/rate', (req, res) => {
  const { fileName, rating } = req.body;
  if (!fileRatings[fileName]) {
    fileRatings[fileName] = [];
  }
  fileRatings[fileName].push(rating);
  res.send({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
