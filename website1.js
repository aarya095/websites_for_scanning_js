const fs = require('fs');
const https = require('https');
const express = require('express');

const app = express();

// Load SSL Certificates
const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
};

app.get('/', (req, res) => {
    res.send('Hello, this is a secure HTTPS server!');
});

https.createServer(options, app).listen(3000, () => {
    console.log('HTTPS Server running on https://localhost:3000');
});
