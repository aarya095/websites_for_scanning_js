const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: true,
  })
);

// ❌ Hardcoded User Credentials (Broken Authentication)
const USERS = [
  { username: "admin", password: "password123" },
  { username: "user", password: "1234" }
];

// 📌 Homepage (XSS Vulnerability)
let comments = [];
app.get("/", (req, res) => {
  res.render("index", { comments });
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

  // 🛑 SQL Injection Vulnerability (String Concatenation)
  let query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  console.log("Executing Query:", query); // Logging query to console

  // Fake SQL Processing (Mimicking a Vulnerable SQL Query)
  let userFound = USERS.some((user) => 
    username.includes(user.username) && password.includes(user.password)
  );

  if (userFound || username.includes("' OR '1'='1")) {
    req.session.user = username;
    res.redirect("/dashboard");
  } else {
    res.render("login", { message: "Invalid Credentials" });
  }
});

// 📌 Dashboard Page (CSRF Vulnerability)
app.get("/dashboard", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  res.render("dashboard", { user: req.session.user });
});

// 📌 Logout Route (Broken Authentication)
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Vulnerable website running on http://localhost:${PORT}`);
});
