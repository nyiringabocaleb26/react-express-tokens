const mysql = require('mysql2/promise');
// const dotenv = require('dotenv');
// dotenv.config();

const pool = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"",
    database:"my_project",
    waitForConnections:true,
    connectionLimit:10,
    queueLimit:0
});
pool.getConnection()
.then(() => console.log('Mysql connected successfully'))
.catch((error) => console.log('error while connecting',error));

module.exports = pool;