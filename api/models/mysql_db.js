import mysql from 'mysql';

import dbConfig from '../config/db.config.js';

const mysqlConnection = mysql.createConnection({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
});

// open the MySQL connection
mysqlConnection.connect(error => {
  if (error) throw error;
  console.log('Successfully connected to the database.');
});

export default mysqlConnection;
