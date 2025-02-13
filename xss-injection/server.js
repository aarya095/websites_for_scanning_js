const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Store comments in an array (Temporary Storage)
let comments = [];

app.get('/', (req, res) => {
    res.render('index', { comments: comments });
});

app.post('/comment', (req, res) => {
    let userComment = req.body.comment;
    comments.push(userComment); // ❌ No Sanitization (XSS Vulnerability)
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`XSS vulnerable site running on http://localhost:${PORT}`);
});
