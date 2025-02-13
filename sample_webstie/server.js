const express = require("express");
const app = express();
const PORT = 3000;

// Serve static files from the "public" folder
app.use(express.static("public"));

// API endpoint that sends a message to the client
app.get("/message", (req, res) => {
    res.json({ message: "Hello from Node.js Server!" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
