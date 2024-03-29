const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'freshfinds'
});



// Endpoint to handle user login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    // Query to check if user exists with the provided credentials
    const query = 'SELECT * FROM user WHERE email = ? AND password = ?';
    connection.query(query, [email, password], (error, results, fields) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }

        // If no user found, return authentication failed
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // User found, return success
        return res.status(200).json({ message: 'Login successful' });
    });
});

// Endpoint to handle user signup
app.post('/signup', (req, res) => {
    const { username, email, password, phone_number, address } = req.body;

    // Check if all required fields are provided
    if (!username || !email || !password || !phone_number || !address) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the email is already registered
    connection.query('SELECT * FROM user WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }

        // If the email is already registered, return an error
        if (results.length > 0) {
            return res.status(409).json({ message: 'Email is already registered' });
        }

        // Insert the new user into the database
        const query = 'INSERT INTO user (user_name, email, password, phone_number, address) VALUES (?, ?, ?, ?, ?)';
        connection.query(query, [username, email, password, phone_number, address], (error) => {
            if (error) {
                console.error('Error executing query:', error);
                return res.status(500).json({ message: 'Internal server error' });
            }

            // User successfully registered
            return res.status(201).json({ message: 'Signup successful' });
        });
    });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
