// ============================================================================
// BREAKOUT IGRA - Node.js Express Server
// ============================================================================

const express = require('express');
const path = require('path');

// Kreiranje Express aplikacije
const app = express();

// Port na kojem će server slušati (PORT iz environment varijable ili 3000)
const PORT = process.env.PORT || 3000;

// Služenje statičkih datoteka iz trenutnog direktorija
app.use(express.static(__dirname));

// Glavna ruta - servira index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Pokretanje servera
app.listen(PORT, () => {
    console.log(`Breakout igra je pokrenuta na http://localhost:${PORT}`);
    console.log(`Pritisnite Ctrl+C za zaustavljanje servera`);
});

