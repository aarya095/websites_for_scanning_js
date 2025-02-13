const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 3000;

// Middleware
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Simulated user session (for demonstration purposes)
let fakeSession = { username: "admin", balance: 1000 };

// Login route (Just sets a cookie)
app.get("/", (req, res) => {
    res.render("index");
});

// Dashboard - Shows balance and provides a transfer form
app.get("/dashboard", (req, res) => {
    if (!req.cookies.session) {
        return res.redirect("/");
    }
    res.render("dashboard", { user: fakeSession });
});

// **🚨 CSRF Vulnerable Transfer Route**
app.post("/transfer", (req, res) => {
    const amount = parseInt(req.body.amount, 10);
    if (!isNaN(amount) && amount > 0) {
        fakeSession.balance -= amount;
        console.log(`[ALERT] Money transferred: ${amount}`);
    }
    res.send(`<h3>Transfer successful! New Balance: $${fakeSession.balance}</h3>`);
});

// Fake login (Sets a session cookie)
app.post("/login", (req, res) => {
    res.cookie("session", "fake-session-token", { httpOnly: false }); // 🚨 No secure flag, vulnerable
    res.redirect("/dashboard");
});

app.listen(PORT, () => {
    console.log(`🚨 CSRF vulnerable site running at http://localhost:${PORT}`);
});
