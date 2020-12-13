import mysql from 'mysql';
import { MYSQL_DB_CONFIG as dbConfig } from '../config';

const mysqlConnection = mysql.createPool({
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
});

export default mysqlConnection;
