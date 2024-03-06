
const mysql = require('mysql');

const connection= mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "freshfinds"
});
// Connecting to the MySQL database
connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
      return;
    }
    console.log('Connected to MySQL database!');
  });// Perform a simple query to fetch data from a table
connection.query('SELECT * FROM user', (error, results, fields) => {
    if (error) {
      console.error('Error executing query:', error);
      return;
    }
    console.log('Query results:', results);
  });
  
  
  // Close the connection when done
connection.end();