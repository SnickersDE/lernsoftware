const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.static('public'));
app.use(express.json());

app.listen(3000, () => {
    console.log('Server läuft auf Port 3000');
});
