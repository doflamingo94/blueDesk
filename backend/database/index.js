const mysql = require("mysql2");

const pool = mysql.createPool({
    // host: process.env.DB_HOST,
    // user: process.env.DB_USERNAME,
    // database: process.env.DB_NAME,
    // password: process.env.DB_PASSWORD
    host: '35.180.32.103',
    user: 'root',
    database: 'blueDesk',
    password: 'Simplon16',
    port: 3306
});

module.exports = pool.promise();