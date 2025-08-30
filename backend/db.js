const { Client } = require("pg");

const con = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "sheraz12",   
  database: "unifyp"
});

con.connect()
  .then(() => console.log(" DB connected"))
  .catch(err => console.error("DB error:", err));

module.exports = con;
