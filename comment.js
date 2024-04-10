// Create web server
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const port = 3000;

// Set up body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up static files
app.use(express.static('public'));

// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set up routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/comments', (req, res) => {
    // Read comments from file
    fs.readFile('comments.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Internal server error');
        }
        res.json(JSON.parse(data));
    });
});

app.post('/comments', (req, res) => {
    // Get comment from request body
    const comment = req.body.comment;
    // Read comments from file
    fs.readFile('comments.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Internal server error');
        }
        // Parse comments
        const comments = JSON.parse(data);
        // Add new comment
        comments.push(comment);
        // Write comments to file
        fs.writeFile('comments.json', JSON.stringify(comments), (err) => {
            if (err) {
                res.status(500).send('Internal server error');
            }
            res.json(comments);
        });
    });
});

// Start web server
app.listen(port, () => {
    console.log('Web server is running on port ' + port);
});