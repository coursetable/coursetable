const die = (err) => {
  throw new Error(err);
};

export default {
  host: process.env.MYSQL_HOST || die('mysql host'),
  port: parseInt(process.env.MYSQL_PORT, 10) || die('mysql port'),
  user: process.env.MYSQL_USER || die('mysql username'),
  password: process.env.MYSQL_PASSWORD || die('mysql password'),
  database: process.env.MYSQL_DB || die('mysql db'),
};
