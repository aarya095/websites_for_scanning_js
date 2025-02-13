const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const PORT = 3000;

// Insecure User Database (Hardcoded for Demo)
const users = {
    admin: "password123",  // ❌ Weak password
    user: "userpass"       // ❌ No password policy
};

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Insecure Session Management (No expiry, No secure flag)
app.use(session({
    secret: "secretKey",  // ❌ Hardcoded Secret
    resave: false,
    saveUninitialized: true
}));

// Login Page
app.get('/', (req, res) => {
    res.render('login');
});

// Authentication Route (No Account Lockout, No Rate Limiting)
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (users[username] && users[username] === password) {
        req.session.user = username; // ❌ Session Fixation Risk
        return res.redirect('/dashboard');
    } else {
        return res.send("❌ Invalid Credentials! Try Again.");
    }
});

// Dashboard (No Session Expiry Check)
app.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.send("❌ Unauthorized Access! Please login.");
    }
    res.render('dashboard', { user: req.session.user });
});

// Logout (Does Not Destroy Session Properly)
app.get('/logout', (req, res) => {
    req.session.user = null;  // ❌ Session remains valid until expired
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Broken Auth Site Running on http://localhost:${PORT}`);
});
