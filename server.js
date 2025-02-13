// Import the express module
const express = require('express');

// Create an express app
const app = express();

// Define the port
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Home route ("/")
app.get('/', (req, res) => {
  res.send('<h1>Welcome to my Basic Node.js Website!</h1><p>This is a basic Node.js website using Express.</p>');
});

// About route ("/about")
app.get('/about', (req, res) => {
  res.send('<h1>About Us</h1><p>This website is built using Node.js and Express.</p>');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
