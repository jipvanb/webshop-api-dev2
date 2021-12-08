const sqlite3 = require("sqlite3").verbose();

const DBSOURCE = "./database/database.db";

const db = new sqlite3.Database(DBSOURCE, function (err) {
  if (err) {
    throw err;
  }
  console.log("Database connected");
});

module.exports = db;
