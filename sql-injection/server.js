require("dotenv").config(); // Load environment variables
console.log("Database Name from .env:", process.env.DB_NAME);
console.log("Database Name from .env:", process.env.DB_NAME_WEBSITE);

const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// ✅ Fetch MySQL credentials from .env file
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME_WEBSITE
});

db.connect(err => {
    if (err) throw err;
    console.log("Connected to MySQL Database!");
});

// Login Page
app.get("/", (req, res) => {
    res.render("index");
});

// Vulnerable Login Route (SQL Injection Possible!)
app.post("/login", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    // 🚨 SQL Injection Vulnerable Query 🚨
    let query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

    console.log("Executing Query:", query); // Logs query to console (for testing)

    db.query(query, (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.send(`<h1>Welcome, ${username}!</h1>`);
        } else {
            res.send(`<h1>Invalid credentials</h1>`);
        }
    });
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
