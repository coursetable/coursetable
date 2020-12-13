const die = (err: string) => {
  throw new Error(err);
};

export default {
  host: process.env.MYSQL_HOST || die('mysql host'),
  port: parseInt(process.env.MYSQL_PORT || die('mysql port'), 10),
  user: process.env.MYSQL_USER || die('mysql username'),
  password: process.env.MYSQL_PASSWORD || die('mysql password'),
  database: process.env.MYSQL_DB || die('mysql db'),
};
