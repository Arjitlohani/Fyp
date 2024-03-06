const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// MySQL Connection Configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'freshfinds'
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Endpoint to handle user login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Query to fetch user from database based on email and password
  const query = `SELECT * FROM user WHERE email = ? AND password = ?`;
  connection.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Check if user with provided credentials exists
    if (results.length === 0) {
      res.status(401).json({ error: 'Invalid email or password' });
    } else {
      // User authenticated successfully
      res.status(200).json({ message: 'Login successful', user: results[0] });
    }
  });
});

// Endpoint to handle user registration
app.post('/register', (req, res) => {
  const { email, password } = req.body;

  // Check if user with provided email already exists
  const checkQuery = `SELECT * FROM user WHERE email = ?`;
  connection.query(checkQuery, [email], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // If user already exists, return error
    if (results.length > 0) {
      res.status(400).json({ error: 'User with this email already exists' });
    } else {
      // If user does not exist, insert new user into database
      const insertQuery = `INSERT INTO user (email, password) VALUES (?, ?)`;
      connection.query(insertQuery, [email, password], (err, results) => {
        if (err) {
          console.error('Error executing MySQL query:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }

        res.status(201).json({ message: 'Registration successful' });
      });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
