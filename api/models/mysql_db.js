import mysql from 'mysql';
import dbConfig from '../config/db.config.js';

const mysqlConnection = mysql.createPool({
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
});

export default mysqlConnection;
