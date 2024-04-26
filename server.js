const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Database connection
const db = new sqlite3.Database('./scamReports.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error("Error when opening the database", err);
    } else {
        console.log("Database connected!");
        db.run(`CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userName TEXT,
            title TEXT,
            scamType TEXT,
            description TEXT,
            date TEXT,
            platform TEXT
        )`, (err) => {
            if (err) {
                console.error("Error creating table", err);
            } else {
                console.log("Table created or already exists");
            }
        });
    }
});

// Define routes to serve the HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
});

app.get('/report', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'report.html'));
});

app.get('/database', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'database.html'));
});

app.get('/help', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'help.html'));
});

// API route to get reports
app.get('/reports', (req, res) => {
    let sql = "SELECT id, userName, title, date FROM reports";
    const params = [];

    if (req.query.type) {
        sql += " WHERE scamType = ?";
        params.push(req.query.type);
    }

    if (req.query.sort) {
        sql += " ORDER BY " + req.query.sort;
        if (req.query.order) {
            sql += " " + req.query.order;
        }
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

// API route to handle form submission
app.post('/submit-report', (req, res) => {
    const { userName, title, scamType, description, date, platform } = req.body;
    const sql = `INSERT INTO reports (userName, title, scamType, description, date, platform)
                VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [userName, title, scamType, description, date, platform];

    db.run(sql, params, function(err) {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json({
            "message": "Report Successfully Added",
            "id": this.lastID
        });
    });
});


// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
