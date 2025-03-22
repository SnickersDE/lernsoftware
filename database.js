const fs = require('fs');

function saveMessage(username, message) {
    const log = { username, message, timestamp: new Date() };
    fs.appendFile('messages.json', JSON.stringify(log) + '\n', (err) => {
        if (err) console.error('Fehler beim Speichern:', err);
    });
}

module.exports = { saveMessage };
