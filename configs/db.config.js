const mysql = require("mysql2");
const pool = mysql
  .createPool({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  })
  .promise();

module.exports = pool;
