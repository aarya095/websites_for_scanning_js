require("dotenv").config(); // Load environment variables

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const mysql = require("mysql2");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 3000;

// Set EJS as the templating engine
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// 🛠️ Session Setup (Weak Security - No Expiry, Broken Authentication)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: true,
  })
);

// 📌 Database Connection (SQL Injection Vulnerable)
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME_WEBSITE,
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL Database!");
});

// 📌 Homepage (XSS Vulnerability)
let comments = [];
app.get("/", (req, res) => {
  res.render("index", { comments: comments });
});

app.post("/comment", (req, res) => {
  let userComment = req.body.comment;
  comments.push(userComment); // ❌ No Sanitization (XSS Vulnerability)
  res.redirect("/");
});

// 📌 Login Page (SQL Injection Vulnerability)
app.get("/login", (req, res) => {
  res.render("login", { message: "" });
});

app.post("/login", (req, res) => {
  let { username, password } = req.body;

  // 🛑 SQL Injection Vulnerability (Direct String Query)
  let query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  console.log("Executing Query:", query); // Logging query to console

  db.query(query, (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      req.session.user = username; // Weak Authentication
      res.redirect("/dashboard");
    } else {
      res.render("login", { message: "Invalid Credentials" });
    }
  });
});

// 📌 Dashboard Page (CSRF Vulnerability)
app.get("/dashboard", (req, res) => {
  if (!req.session.user) return res.redirect("/login"); // Weak authentication check
  res.render("dashboard", { user: req.session.user });
});

// 📌 Logout Route (Broken Authentication - Session Not Properly Handled)
app.get("/logout", (req, res) => {
  req.session.destroy(); // Weak Logout Handling
  res.redirect("/");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Vulnerable website running on http://localhost:${PORT}`);
});
