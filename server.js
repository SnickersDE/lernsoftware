const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const app = express();
const PORT = 3000;

// Multer-Konfiguration für den Datei-Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// PDF-Dateien speichern
let files = [];

// Stelle sicher, dass der Upload-Ordner existiert
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// API zum Hochladen von PDFs
app.post('/upload', upload.single('pdf'), (req, res) => {
    const { schwerpunkt } = req.body;
    const file = req.file;
    if (!file) {
        return res.status(400).json({ message: 'Kein PDF ausgewählt.' });
    }
    const newFile = { name: file.filename, schwerpunkt };
    files.push(newFile);
    res.json({ message: 'PDF erfolgreich hochgeladen.' });
});

// API zum Abrufen von PDFs
app.get('/files', (req, res) => {
    const schwerpunkt = req.query.schwerpunkt;
    const filteredFiles = files.filter(file => file.schwerpunkt === schwerpunkt);
    res.json(filteredFiles);
});

app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
